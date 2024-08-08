import { Component, OnInit, inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastService, ToastrTypes } from "../../../../../services/toast.service";
import { LoadingSpinnerDialogContentComponent } from "../../../../../shared/loading-spinner-dialog-content/loading-spinner-dialog-content";
import { ImportGasTransactionResponse } from "../../models/ImportGasTransactionResponse";
import { GasTransactionService } from "../../services/gas-transaction.service";


@Component({
  selector: 'app-import-gas-transactions-dialog',
  standalone: true,
  imports: [
    LoadingSpinnerDialogContentComponent
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
          this.snackService.openImportStatistics(importResponse, ToastrTypes.info, 'Success!')
        }
        else if (importResponse.InvalidRows === 0 && importResponse.ImportedRows >= importResponse.NewRowsInsertedIntoDatabase) {
          this.snackService.openImportStatistics(importResponse, ToastrTypes.warning, 'Warning! Import succeeded but some rows were already in the database.')
        }
        else if (importResponse.InvalidRows > 0) {
          this.snackService.openImportStatistics(importResponse, ToastrTypes.error, 'Error!')
        }
        else {
          this.snackService.openImportStatistics(importResponse, ToastrTypes.error, 'Error! Invalid import statistics.')
        }
      }
    }
    this.loading = false
    this.dialogRef.close(true);
  }
}
