import { Component } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner-dialog-content',
  standalone: true,
  imports: [
    MatProgressSpinner, MatDialogContent
  ],
  templateUrl: `./loading-spinner-dialog-content.html`,
  styleUrl: './loading-spinner-dialog-content.scss'
})
export class LoadingSpinnerDialogContentComponent {

}
