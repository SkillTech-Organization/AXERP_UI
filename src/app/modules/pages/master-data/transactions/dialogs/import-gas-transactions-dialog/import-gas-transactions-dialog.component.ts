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
        if (importResponse.InvalidRows === 0) {
          this.snackService.openInfo('Import successful!')
        }
        else if (importResponse.InvalidRows > 0) {
          this.snackService.openWarning('One or more rows could not be imported!')
        }
        else if (importResponse.ImportedRows > 0 && importResponse.InvalidRows == importResponse.ImportedRows) {
          this.snackService.openError('Error! No row could be imported!')
        }
      }
    }
    this.loading = false
    this.dialogRef.close(true);
  }
}
