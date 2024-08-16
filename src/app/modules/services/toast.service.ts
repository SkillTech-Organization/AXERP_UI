import { Injectable } from "@angular/core"
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar"
import { ImportGasTransactionResponse } from "../pages/master-data/transactions/models/ImportGasTransactionResponse"
import { ProcessBlobFilesResponse } from "../pages/master-data/transactions/models/ProcessBlobFilesResponse"
import { GasTransactionBlobProcessingStatisticsSnackbarComponent } from "../pages/master-data/transactions/snackbars/gas-transaction-blob-processing-statistics-snackbar/gas-transaction-blob-processing-statistics-snackbar.component"
import { ImportStatisticsSnackbarComponent } from "../pages/master-data/transactions/snackbars/import-statistics-snackbar/import-statistics-snackbar.component"

export enum ToastrTypes {
  info = "snackbar-info",
  warning = "snackbar-warning",
  error = "snackbar-error"
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) { }

  openInfo(message: any, durationMs: number = 5000) {
    this._snackBar.open(message, 'Close', {
      panelClass: "snackbar-info",
      duration: durationMs,
    } as MatSnackBarConfig)
  }

  openWarning(message: any, durationMs: number = 5000) {
    this._snackBar.open(message, 'Close', {
      panelClass: "snackbar-warning",
      duration: durationMs,
    } as MatSnackBarConfig)
  }

  openError(message: any, durationMs: number = 5000, consoleError: boolean = true) {
    if (consoleError) {
      console.error(message)
    }
    this._snackBar.open(message, 'Close', {
      panelClass: "snackbar-error",
      duration: durationMs,
    } as MatSnackBarConfig)
  }

  open(message: any, type: ToastrTypes, durationMs: number = 5000) {
    this._snackBar.open(message, 'Close', {
      panelClass: type,
      duration: durationMs,
    } as MatSnackBarConfig)
  }

  openImportStatistics(importData: ImportGasTransactionResponse, type: ToastrTypes, message?: string, durationMs: number = 10000) {
    this._snackBar.openFromComponent(ImportStatisticsSnackbarComponent, {
      panelClass: type,
      duration: durationMs,
      data: { data: importData, message: message}
    } as MatSnackBarConfig)
  }

  openBlobStatistics(importData: ProcessBlobFilesResponse, type: ToastrTypes, message?: string, durationMs: number = 10000) {
    this._snackBar.openFromComponent(GasTransactionBlobProcessingStatisticsSnackbarComponent, {
      panelClass: type,
      duration: durationMs,
      data: { data: importData, message: message }
    } as MatSnackBarConfig)
  }
}
