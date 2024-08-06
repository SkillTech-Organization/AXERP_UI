import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ButtonColor = 'primary' | 'danger'

@Component({
  selector: 'app-manager-button',
  standalone: true,
  imports: [
    MatButtonModule, MatIconModule, CommonModule
  ],
  templateUrl: './manager-button.component.html',
  styleUrl: './manager-button.component.scss'
})
export class ManagerButtonComponent {
  @Input() icon!: string
  @Input() disabled: boolean = false
  @Input() color: ButtonColor = 'primary'

  @Output() btnClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>()

  clicked(event: MouseEvent) {
    this.btnClick.emit(event)
  }
}
