import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import-statistics-snackbar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './import-statistics-snackbar.component.html',
  styleUrl: './import-statistics-snackbar.component.scss'
})
export class ImportStatisticsSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  
  _data = inject(MAT_SNACK_BAR_DATA);

  get data(): any {
    return this._data.data
  }
  
  get message(): any {
    return this._data.message
  }
}
