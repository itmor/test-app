import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum ToastPosition {
  Left = 'left',
  Right = 'right',
}

export enum ToastStyle {
  Success = 'success',
  Error = 'error',
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() position: ToastPosition;
  @Input() style: ToastStyle;
}
