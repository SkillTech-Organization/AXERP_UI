import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ImportStatisticsSnackbarComponent } from '../shared/snackbars/import-statistics-snackbar/import-statistics-snackbar.component';
import { ImportGasTransactionResponse } from '../business/master-data/models/ImportGasTransactionResponse';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) { }

  openInfo(message: string, durationMs: number = 5000) {
    this._snackBar.open(message, 'Close', {
      panelClass: "snackbar-info",
      duration: durationMs,
    } as MatSnackBarConfig)
  }

  openWarning(message: string, durationMs: number = 5000) {
    this._snackBar.open(message, 'Close', {
      panelClass: "snackbar-warning",
      duration: durationMs,
    } as MatSnackBarConfig)
  }

  openError(message: string, durationMs: number = 5000) {
    this._snackBar.open(message, 'Close', {
      panelClass: "snackbar-error",
      duration: durationMs,
    } as MatSnackBarConfig)
  }

  openImportStatisticsInfo(importData: ImportGasTransactionResponse, message?: string, durationMs: number = 10000) {
    this._snackBar.openFromComponent(ImportStatisticsSnackbarComponent, {
      panelClass: "snackbar-info",
      duration: durationMs,
      data: { data: importData, message: message}
    } as MatSnackBarConfig)
  }

  openImportStatisticsWarning(importData: ImportGasTransactionResponse, message?: string, durationMs: number = 10000) {
    this._snackBar.openFromComponent(ImportStatisticsSnackbarComponent, {
      panelClass: "snackbar-warning",
      duration: durationMs,
      data: { data: importData, message: message }
    } as MatSnackBarConfig)
  }

  openImportStatisticsError(importData: ImportGasTransactionResponse, message?: string, durationMs: number = 10000) {
    this._snackBar.openFromComponent(ImportStatisticsSnackbarComponent, {
      panelClass: "snackbar-error",
      duration: durationMs,
      data: { data: importData, message: message }
    } as MatSnackBarConfig)
  }
}
