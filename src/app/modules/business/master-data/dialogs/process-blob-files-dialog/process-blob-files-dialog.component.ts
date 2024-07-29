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
import { ToastrTypes, ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-process-blob-files-dialog',
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
          this.snackService.openBlobStatistics(importResponse, ToastrTypes.info, 'Success!')
        }
        else if (importResponse.Errors.length > 0 && importResponse.Processed.length > 0) {
          this.snackService.openBlobStatistics(importResponse, ToastrTypes.warning, 'Not all blob files could be processed!')
        }
        else if (importResponse.Errors.length > 0 && importResponse.Processed.length === 0) {
          this.snackService.openBlobStatistics(importResponse, ToastrTypes.error, 'Error!')
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
