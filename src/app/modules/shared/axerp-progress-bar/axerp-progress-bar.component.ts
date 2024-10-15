import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-axerp-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './axerp-progress-bar.component.html',
  styleUrl: './axerp-progress-bar.component.scss'
})
export class AxerpProgressBarComponent {
  @Input() value: number = 0
}
