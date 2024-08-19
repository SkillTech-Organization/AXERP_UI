import { Component, OnInit, inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LoadingSpinnerDialogContentComponent } from "../../loading-spinner-dialog-content/loading-spinner-dialog-content";


@Component({
  selector: 'app-loading-spinner-dialog',
  standalone: true,
  imports: [
    LoadingSpinnerDialogContentComponent
  ],
  template: `
    <app-loading-spinner-dialog-content>
      {{data}}
    </app-loading-spinner-dialog-content>
  `,
  styleUrl: './loading-spinner-dialog.component.scss'
})
export class LoadingSpinnerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<LoadingSpinnerDialogComponent>);

  data = inject(MAT_DIALOG_DATA)

  constructor() {}
}
