import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export enum Type {
  Email = 'Email',
  Password = 'password',
}

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() type: Type;
  @Input() formControlName: string;

  readonly Type = Type;

  value: string;
  control: UntypedFormControl;

  private controlContainer = inject(ControlContainer);

  ngOnInit() {
    this.control = this.controlContainer.control.get(this.formControlName) as UntypedFormControl;
  }

  public onChange = (_: string): void => {};
  public onTouch = (): void => {};

  writeValue(value: any): void {
    this.value = value;
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  get isValid(): boolean {
    return this.control.valid;
  }
}
