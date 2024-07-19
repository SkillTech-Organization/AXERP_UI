import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
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

  constructor(private service: GasTransactionService) {

  }

  async ngOnInit(): Promise<void> {
    const response = await this.service.ImportGasTransactions()
    if (response?.Value) {
      this.data = response.Value
    }
    this.loading = false
  }

  onCloseClick(): void {
    this.dialogRef.close(true);
  }
}
