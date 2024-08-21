import { Component, OnInit, inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastService, ToastrTypes } from "../../../../../services/toast.service";
import { LoadingSpinnerDialogContentComponent } from "../../../../../shared/loading-spinner-dialog-content/loading-spinner-dialog-content";
import { ImportGasTransactionResponse } from "../../models/ImportGasTransactionResponse";
import { GasTransactionService } from "../../services/gas-transaction.service";


@Component({
  selector: 'app-process-blob-files-dialog',
  standalone: true,
  imports: [
    LoadingSpinnerDialogContentComponent
],
  templateUrl: './process-blob-files-dialog.component.html',
  styleUrl: './process-blob-files-dialog.component.scss'
})
export class ProcessBlobFilesDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProcessBlobFilesDialogComponent>);

  loading: boolean = true

  data?: ImportGasTransactionResponse

  constructor(private service: GasTransactionService,
    private snackService: ToastService) {

  }

  async ngOnInit(): Promise<void> {
    const response = await this.service.ProcessBlobFiles()
    if (response?.Value) {
      const importResponse = response?.Value

      if (!importResponse.IsSuccess) {
        this.snackService.openError(importResponse.RequestError ?? "Internal Server Error")
      } else {
        if (importResponse.Errors.length === 0) {
          this.snackService.openInfo('Files processed successfully!')
        }
        else if (importResponse.Errors.length > 0 && importResponse.Processed.length > 0) {
          this.snackService.openWarning('Some files could not be processed!')
        }
        else if (importResponse.Errors.length > 0 && importResponse.Processed.length === 0) {
          this.snackService.openError('Error! No file could be processed!')
        }
      }
    }
    this.loading = false
    this.dialogRef.close(true);
  }
}
