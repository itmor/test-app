import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum Color {
  Warn = 'warn',
}
@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './ui-button.component.html',
  imports: [CommonModule],
  styleUrl: './ui-button.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  readonly Color = Color;
  @Input() color: Color;
}
