import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormService } from '@shared/services/form.service';
import { UserService } from './modules/user/services/user.service';
import { ToastService } from '@shared/services/toast.service';

import { UiPageComponent } from '@shared/components/ui-page/ui-page.component';
import { Type, UiInputComponent } from '@shared/components/ui-input/ui-input.component';
import { UiDropdownComponent } from '@shared/components/ui-dropdown/ui-dropdown.component';
import { Color, UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiLoaderComponent } from '@shared/components/ui-loader/ui-loader.component';

import { UserModel, UserType } from './modules/user/models/user.model';

import { ValidationErrorDirective } from '@shared/directives/validation-error.directive';
import { ToastPosition, ToastStyle } from '@shared/components/toast/toast.component';

enum EditorActionType {
  Edit = 'edit',
  Create = 'create',
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UiPageComponent,
    UiInputComponent,
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorDirective,
    UiButtonComponent,
    UiDropdownComponent,
    UiLoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly EditorActionType = EditorActionType;
  readonly Type = Type;
  readonly UserType = UserType;
  readonly Color = Color;

  users$: Observable<UserModel[]>;
  isEditorOpened: boolean;
  editorType: EditorActionType;
  selectedUser: UserModel;
  formGroup: UntypedFormGroup;
  isLoading: boolean;
  users: UserModel[] = [];

  tableUpdateRequested$ = new Subject();

  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.toastService.setViewContainerRef(this.viewContainerRef);

    this.tableUpdateRequested$
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.changeDetectorRef.markForCheck();
        }),
        switchMap(() => this.userService.getUsers()),
        tap((users) => {
          this.users = users;
          this.changeDetectorRef.markForCheck();
        }),
        tap(() => {
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.formGroup = this.fb.group(
      {
        id: [null],
        userName: [null, Validators.required],
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        type: [UserType.Administrator, Validators.required],
        password: [Validators.required],
        confirmPassword: [null],
      },
      { validators: this.passwordMatchValidator },
    );

    this.requestTableUpdate();
  }

  passwordMatchValidator(formGroup: UntypedFormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword').setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword').setErrors(null);
    }
  }

  openEditor(editorType: EditorActionType, user?: UserModel): void {
    this.isEditorOpened = true;
    this.editorType = editorType;

    if (user) {
      this.selectedUser = user;
      this.fillFormGroup(user);
      return;
    }
    this.resetForm();
  }

  closeEditor(): void {
    this.isEditorOpened = false;
    this.editorType = null;
    this.selectedUser = null;
    this.resetForm();
  }

  private fillFormGroup(user: UserModel): void {
    this.resetForm();
    this.formGroup.patchValue(user);
  }

  private resetForm(): void {
    this.formGroup.reset();
    Object.values(this.formGroup.controls).forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
    });
    this.formGroup.get('type').setValue(UserType.Administrator);
  }

  createUser(): void {
    if (!this.formService.validate(this.formGroup)) {
      return;
    }

    this.isLoading = true;
    this.userService
      .addUser(this.formGroup.value)
      .pipe(
        catchError((error) => {
          this.formGroup.get(error.control).setErrors({ [error.error]: true });
          this.toastService.show('Ошибка при сохранении пользователя', ToastPosition.Left, ToastStyle.Error);
          this.isLoading = false;
          return throwError(error);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.toastService.show('Юзер успешно добавлен', ToastPosition.Right, ToastStyle.Success);
        this.requestTableUpdate();
        this.isEditorOpened = false;
      });
  }

  updateUser(): void {
    if (!this.formService.validate(this.formGroup)) {
      return;
    }

    this.isLoading = true;
    this.userService
      .updateUser(this.formGroup.value)
      .pipe(
        catchError((error) => {
          this.formGroup.get(error.control).setErrors({ [error.error]: true });
          this.isLoading = false;
          this.toastService.show('Ошибка при сохранении пользователя', ToastPosition.Left, ToastStyle.Error);
          return throwError(error);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.toastService.show('Юзер успешно обновлен', ToastPosition.Right, ToastStyle.Success);
        this.requestTableUpdate();
        this.isEditorOpened = false;
      });
  }

  removeUser(): void {
    this.isLoading = true;
    this.userService
      .removeUser(this.formGroup.value.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.show('Юзер успешно удален', ToastPosition.Right, ToastStyle.Success);
        this.requestTableUpdate();
        this.isEditorOpened = false;
      });
  }

  private requestTableUpdate(): void {
    this.tableUpdateRequested$.next(null);
  }
}
