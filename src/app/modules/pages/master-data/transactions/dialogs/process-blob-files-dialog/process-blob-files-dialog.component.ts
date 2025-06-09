import { Component, OnInit, inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastService } from "../../../../../services/toast.service";
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
    let message = '';
    if (response?.Value) {
      const importResponse = response?.Value

      if (!importResponse.IsSuccess) {
        message = importResponse.RequestError ?? "Internal Server Error"
        this.snackService.openError(message)
      } else {
        if (importResponse.Errors.length == 0 && importResponse.Warnings.length == 0 && importResponse.Processed.length == 0) {
          message = "No new file to process!";
          this.snackService.openInfo(message);
        }
        else if (importResponse.Errors.length == 0 && importResponse.Warnings.length > 0 && importResponse.Processed.length == 0) {
          message = "There were no processable blob files, but there were warnings!";
          this.snackService.openInfo(message);
        }
        else if (importResponse.Errors.length == 0) {
          message = "Success!";
          this.snackService.openInfo(message);
        }
        else if (importResponse.Errors.length > 0 && importResponse.Processed.length > 0) {
          message = "Not all files could be processed!";
          this.snackService.openWarning(message);
        }
        else if (importResponse.Errors.length > 0 && importResponse.Processed.length == 0) {
          message = "Error! No file could be processed!";
          this.snackService.openError(message);
        }
      }
    }

    this.loading = false
    this.dialogRef.close(message);
  }
}
