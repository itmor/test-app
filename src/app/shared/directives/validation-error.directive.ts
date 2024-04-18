import { DestroyRef, Directive, ElementRef, inject, Injector, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[validationError]',
  standalone: true,
})
export class ValidationErrorDirective implements OnInit {
  private elementRef: ElementRef;
  private ngControl: NgControl;
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.elementRef = this.injector.get(ElementRef);
    this.ngControl = this.injector.get(NgControl);

    this.ngControl.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.showError();
    });
  }

  private showError(): void {
    const control = this.ngControl.control;
    const errorMessage = this.getErrorMessage();

    this.removeErrorMessage();

    if (control.touched && errorMessage) {
      const errorElement = document.createElement('div');
      errorElement.classList.add('app__error-message');
      errorElement.textContent = errorMessage;
      this.elementRef.nativeElement.insertAdjacentElement('afterend', errorElement);
    }
  }

  private getErrorMessage(): string {
    const controlErrors = this.ngControl.errors;
    if (!controlErrors) {
      return null;
    }

    const errorKey = Object.keys(controlErrors)[0];

    switch (errorKey) {
      case 'required':
        return 'Поле обязательно к заполнению';
      case 'email':
        return 'Неправильное поле почты';
      case 'pattern':
        return 'Поле не совпадает с патерном';
      case 'passwordMismatch':
        return 'Пароль подтверждения должен совпадать с основным паролем';
      case 'isUserNameTaken':
        return 'Имя пользователя уже занято';
      default:
        return 'Неправильное значение';
    }
  }

  private removeErrorMessage(): void {
    const sibling = this.elementRef.nativeElement.nextElementSibling;
    if (sibling && sibling.classList.contains('app__error-message')) {
      sibling.remove();
    }
  }
}
