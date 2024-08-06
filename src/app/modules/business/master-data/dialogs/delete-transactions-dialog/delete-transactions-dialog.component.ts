import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { GasTransactionService } from '../../services/gas-transaction.service';
import { ToastService } from '../../../../services/toast.service';
import { LoadingSpinnerDialogContentComponent } from '../../../../shared/loading-spinner-dialog-content/loading-spinner-dialog-content';

@Component({
  selector: 'app-delete-transactions-dialog',
  standalone: true,
  imports: [
    LoadingSpinnerDialogContentComponent
  ],
  templateUrl: './delete-transactions-dialog.component.html',
  styleUrl: './delete-transactions-dialog.component.scss'
})
export class DeleteTransactionsDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DeleteTransactionsDialogComponent>);

  loading: boolean = true

  data = inject(MAT_DIALOG_DATA)

  constructor(private service: GasTransactionService,
    private snackService: ToastService) {

  }

  async ngOnInit(): Promise<void> {
    const response = await this.service.DeleteTransactions(this.data)
    if (response?.Value) {
      const importResponse = response?.Value

      if (!importResponse.IsSuccess) {
        this.snackService.openError(importResponse.RequestError ?? "Delete failed! Internal Server Error")
      } else {
        this.snackService.openInfo('Delete was successful!')
      }
    }
    this.loading = false
    this.dialogRef.close(true);
  }
}
