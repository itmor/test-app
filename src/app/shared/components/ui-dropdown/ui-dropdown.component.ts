import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDropdownComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDropdownComponent implements ControlValueAccessor {
  @Input() items: { value: any; label: string }[] = [];
  showDropdown = false;
  selectedItem: { value: any; label: string };

  private onChange: any = () => {};
  private onTouch: any = () => {};

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectItem(value: any) {
    this.selectedItem = this.items.find((item) => item.value === value);
    this.showDropdown = false;
    this.onChange(value);
    this.onTouch();
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  writeValue(value: any) {
    this.selectedItem = this.items.find((item) => item.value === value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
