import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MockService } from '../../../services/mock.service';
import { GasTransaction } from '../models/GasTransaction';
import { GridModel } from '../../../../util/models/GridModel';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GasTransactionService } from '../services/gas-transaction.service';
import { PagedQueryRequest } from '../../../../util/models/PagedQueryRequest';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImportGasTransactionsDialogComponent } from '../dialogs/import-gas-transactions-dialog/import-gas-transactions-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-gas-transactions-manager',
  templateUrl: './gas-transactions-manager.component.html',
  styleUrl: './gas-transactions-manager.component.scss',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, MatTableModule, 
    MatCardModule, MatButtonModule, MatPaginatorModule,
    MatSortModule, MatCheckboxModule, MatDividerModule, MatIconModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatProgressSpinner
  ],
  providers: [MockService]
})
export class GasTransactionsManagerComponent implements AfterViewInit {
  @ViewChild(MatSort, {static: true}) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  filter = new FormControl('');

  loading: boolean = true

  gridModel: GridModel = new GridModel([])
  dataSource = new MatTableDataSource<GasTransaction>([])
  selection: SelectionModel<GasTransaction>
  
  readonly dialog = inject(MatDialog);

  _defaultSort: string = 'DeliveryID'
  _activeColumns: string = '' // 'DeliveryID,DateLoadedEnd,DateDelivered,SalesContractID,QtyLoaded,Sales,Terminal'
  _activeSort: string = this._defaultSort
  _activePageIndex: number = 1
  _activePageSize: number = 5
  _orderDesc: boolean = false
  _totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  _searchString: string = ""
  get queryParams(): PagedQueryRequest {
    return {
      Page: this._activePageIndex,
      OrderBy: this._activeSort,
      OrderDesc: this._orderDesc,
      PageSize: this._activePageSize,
      Columns: this._activeColumns,
      Search: this._searchString
    } as PagedQueryRequest
  }

  constructor(
    private gasTransactionService: GasTransactionService,
    private snackService: ToastService
  ) {
    const initialSelection: any[] = []
    const allowMultiSelect = false
    this.selection = new SelectionModel<GasTransaction>(allowMultiSelect, initialSelection)
  }

  //#region Lifecycle

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort

    this.filter.valueChanges.pipe(debounceTime(250)).subscribe(newValue => {
      this._searchString = newValue ?? ""
      this.RefreshData()
    })

    await this.RefreshData()
  }

  clearFilter(): void {
    this.filter.setValue("")
  }

  //#endregion

  //#region Business

  private async RefreshData(): Promise<void> {
    try {
      this.loading = true

      const data = await this.gasTransactionService.QueryGasTransactions(this.queryParams)

      if (!data.Value?.IsSuccess) {
        this.snackService.openError(data.Value?.RequestError ?? "Request (QueryGasTransactions) failed.")
      }
      else if (data) {
        this.dataSource.data = data?.Value?.Data ?? []
        if (data?.Value?.Columns) {
          this.gridModel = GridModel.FromColumnDatas(data.Value.Columns)
        }
        this._totalCount$.next(data.Value?.TotalCount ?? 0)
      }
    }
    catch {
      // notodo
    }
    finally {
      this.loading = false
    }
  }

  public ImportGasTransactions(): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirmation",
        message: "Are you sure you want to import the Gas Transactions?"
      }
    })
    ref.afterClosed().subscribe(result => {
      if (result) {
        const importRef = this.dialog.open(ImportGasTransactionsDialogComponent)
        importRef.afterClosed().subscribe(result => {
          this.RefreshData()
        })
      }
    })
  }

  //#endregion

  //#region Grid events

  selectRows() {
    var sortedData = this.dataSource.sortData(this.dataSource.data, this.sort)
    for (let index = this.dataSource.paginator!.pageIndex * this.dataSource.paginator!.pageSize;
         index < (this.dataSource.paginator!.pageIndex + 1) * this.dataSource.paginator!.pageSize;
         index++
    ) {
      this.selection.select(sortedData[index]);
      // this.selectionAmount = this.selection.selected.length;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected == numRows
  }

  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row))
  }

  sortChange(sortState: Sort) {
    this.selection.clear()

    this._activeSort = sortState.active ?? this._defaultSort
    this._orderDesc = sortState.direction == 'desc'

    // this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.sort)

    this.RefreshData()
  }

  pageChanged(event: PageEvent): void {
    this.selection.clear()

    this._activePageIndex = event.pageIndex
    this._activePageSize = event.pageSize

    this.RefreshData()
  }

  //#endregion
}