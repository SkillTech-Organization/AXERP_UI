import { AfterViewInit, Component } from '@angular/core';
import { MockService } from '../../../../services/mock.service';
import { GasTransaction } from '../models/GasTransaction';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GasTransactionService } from '../services/gas-transaction.service';
import { ConfirmationDialogComponent } from '../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportGasTransactionsDialogComponent } from '../dialogs/import-gas-transactions-dialog/import-gas-transactions-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ToastService } from '../../../../services/toast.service';
import { ProcessBlobFilesDialogComponent } from '../dialogs/process-blob-files-dialog/process-blob-files-dialog.component';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
} from "ag-grid-community";
import { ManagerButtonComponent } from '../../../../shared/buttons/manager-button/manager-button.component';
import { DeleteTransactionsDialogComponent } from '../dialogs/delete-transactions-dialog/delete-transactions-dialog.component';
import { DeleteTransactionRequest } from '../models/DeleteTransactionRequest';
import { BaseGridViewComponent } from '../../../../shared/pages/base-grid-view/base-grid-view.component';
import { ColumnModel, ColumnTypes } from '../../../../../util/models/GridModel';
import moment from 'moment';

@Component({
  selector: 'app-gas-transactions-manager',
  templateUrl: './gas-transactions-manager.component.html',
  styleUrl: './gas-transactions-manager.component.scss',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, 
    MatCardModule, MatButtonModule,
    MatCheckboxModule, MatDividerModule, MatIconModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatProgressSpinner,
    AgGridAngular, ManagerButtonComponent
  ],
  providers: [MockService],
  host: {
    class: 'axerp-data-view-page'
  }
})
export class GasTransactionsManagerComponent extends BaseGridViewComponent<GasTransaction> implements AfterViewInit {
  override gridDiv = document.querySelector<HTMLElement>("#transactionsGrid")!;
  override _defaultSort: string = 'DeliveryID'

  get SelectedIds(): string[] {
    if (!this.gridApi) {
      return []
    }
    return this.gridApi.getSelectedRows().map(x => x.DeliveryID + x.DeliveryIDSffx)
  }

  get DisableManagerButtons(): boolean {
    return this.operationIsInProgress || this.loading
  }

  constructor(
    private gasTransactionService: GasTransactionService,
    private snackService: ToastService
  ) {
    super()
    this._activeSort = this._defaultSort
  }

  //#region Lifecycle

  async ngAfterViewInit() {
    await this.RefreshData()
  }

  //#endregion

  //#region Business

  async RefreshData(): Promise<void> {
    try {
      this.loading = true

      const data = await this.gasTransactionService.QueryGasTransactions(this.queryParams)

      if (!data.Value?.IsSuccess) {
        this.snackService.openError(data.Value?.RequestError ?? "Request (QueryGasTransactions) failed.")
      }
      else if (data) {
        this.data = data?.Value?.Data ?? []
        if (data?.Value?.Columns) {
          this.ProcessColumnData(data?.Value?.Columns)
        }
        this._totalCount$.next(data.Value?.TotalCount ?? 0)
        this.setGridData()
      }
    }
    catch {
      // notodo
    }
    finally {
      this.loading = false
    }
  }

  override GetValueFormatter(element: ColumnModel) {
    if (element.Title === "Delivery ID") {
      return (params: any) => {
        return params.value
      }
    }
    switch (element.ColumnType) {
      case ColumnTypes.number:
        return (params: any) => {
          return params.value?.toFixed(2).toString().replace('.', ',')
        }
      case ColumnTypes.date:
        return (params: any) => {
          if (params.value === null || params.value === undefined || params.value === "") {
            return null
          }
          return moment(params.value).format('DD/M/yyyy hh:mm')
        }
    }
    return undefined
  }

  public ImportGasTransactions(): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirmation",
        message: "Are you sure you want to import the Gas Transactions?"
      }
    })
    ref.afterClosed().subscribe(result => {
      try {
        if (result) {
          this.operationIsInProgress = true
          const dialogRef = this.dialog.open(ImportGasTransactionsDialogComponent)
          dialogRef.afterClosed().subscribe(result => {
            this.operationIsInProgress = false
            this.RefreshData()
          })
        }
      } catch (error: any) {
        this.operationIsInProgress = false
        this.snackService.openError(error.message)
      }
    })
  }

  public ProcessBlobFiles(): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirmation",
        message: "Are you sure you want to process the blob files?"
      }
    })
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.operationIsInProgress = true
        try {
          const dialogRef = this.dialog.open(ProcessBlobFilesDialogComponent)
          dialogRef.afterClosed().subscribe(result => {
            this.operationIsInProgress = false
            this.RefreshData()
          })
        } catch (error: any) {
          this.snackService.openError(error.message)
          this.operationIsInProgress = false
        }
      }
    })
  }

  public DeleteSelectedTransactions(): void {
    if (this.SelectedIds.length === 0) {
      this.snackService.openWarning("At least one row must be selected for delete")
      return
    }
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirmation",
        message: "Are you sure you want to delete the selected transaction(s)?"
      }
    })
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.operationIsInProgress = true
        try {
          const dialogRef = this.dialog.open(DeleteTransactionsDialogComponent, {
            data: new DeleteTransactionRequest(this.SelectedIds)
          })
          dialogRef.afterClosed().subscribe(result => {
            this.operationIsInProgress = false
            this.RefreshData()
          })
        } catch (error: any) {
          this.snackService.openError(error.message)
          this.operationIsInProgress = false
        }
      }
    })
  }

  //#endregion
}