import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { GasTransactionService } from '../../services/gas-transaction.service';
import { ImportGasTransactionResponse } from '../../models/ImportGasTransactionResponse';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-import-gas-transactions-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatProgressSpinner
  ],
  templateUrl: './import-gas-transactions-dialog.component.html',
  styleUrl: './import-gas-transactions-dialog.component.scss'
})
export class ImportGasTransactionsDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ImportGasTransactionsDialogComponent>);

  loading: boolean = true

  data?: ImportGasTransactionResponse

  constructor(private service: GasTransactionService,
              private snackService: ToastService) {

  }

  async ngOnInit(): Promise<void> {
    const response = await this.service.ImportGasTransactions()
    if (response?.Value) {
      const importResponse = response?.Value

      if (!importResponse.IsSuccess) {
        this.snackService.openError(importResponse.RequestError ?? "Internal Server Error")
      } else {
        if (importResponse.InvalidRows === 0 && importResponse.ImportedRows === importResponse.NewRowsInsertedIntoDatabase) {
          this.snackService.openImportStatisticsInfo(importResponse, 'Success!')
          // this.snackService.openInfo(`Success! Imported rows: ${importResponse.ImportedRows}. All rows were inserted without error.`)
        }

        else if (importResponse.InvalidRows === 0 && importResponse.ImportedRows >= importResponse.NewRowsInsertedIntoDatabase) {
          this.snackService.openImportStatisticsWarning(importResponse, 'Warning! Import succeeded but some rows were already in the database.')
          // this.snackService.openInfo(`Success! Imported rows: ${importResponse.ImportedRows}. New rows inserted: ${importResponse.NewRowsInsertedIntoDatabase}.Some rows were already in the database.`)
        }

        else if (importResponse.InvalidRows > 0) {
          this.snackService.openImportStatisticsError(importResponse, 'Error!')
          // this.snackService.openInfo(`Error! Imported rows: ${importResponse.ImportedRows}. New rows inserted: ${importResponse.NewRowsInsertedIntoDatabase}. Invalid rows: ${importResponse.InvalidRows}\nErrors: ${importResponse.ImportErrors}`)
        }

        else {
          this.snackService.openImportStatisticsError(importResponse, 'Error! Invalid import statistics.')
          // this.snackService.openInfo(`Error! Invalid import statistics. Imported rows: ${importResponse.ImportedRows}. New rows inserted: ${importResponse.NewRowsInsertedIntoDatabase}. Invalid rows: ${importResponse.InvalidRows}\nErrors: ${importResponse.ImportErrors}`)
        }
      }
    }
    this.loading = false
    this.dialogRef.close(true);
  }

  onCloseClick(): void {
    this.dialogRef.close(true);
  }
}
