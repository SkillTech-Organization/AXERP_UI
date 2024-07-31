import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MockService } from '../../../services/mock.service';
import { GasTransaction } from '../models/GasTransaction';
import { ColumnModel, ColumnTypes, ColumnTypeToAgFilter, GridModel } from '../../../../util/models/GridModel';
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
import { ProcessBlobFilesDialogComponent } from '../dialogs/process-blob-files-dialog/process-blob-files-dialog.component';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
// import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  createGrid,
} from "ag-grid-community";
import moment from 'moment';
import { ColumnData } from '../../../../util/models/ColumnData';

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
    AgGridAngular
  ],
  providers: [MockService]
})
export class GasTransactionsManagerComponent implements AfterViewInit {
  private gridApi!: GridApi<GasTransaction>;

  gridDiv = document.querySelector<HTMLElement>("#transactionsGrid")!;

  // filter = new FormControl('');

  loading: boolean = true

  gridModel: GridModel = new GridModel([])
  selection: SelectionModel<GasTransaction>

  data: GasTransaction[] = []
  colDefs: ColDef[] = []
  
  readonly dialog = inject(MatDialog);

  _defaultSort: string = 'DeliveryID'
  _activeColumns: string = '' // 'DeliveryID,DateLoadedEnd,DateDelivered,SalesContractID,QtyLoaded,Sales,Terminal'
  _activeSort: string = this._defaultSort
  _activePageIndex: number = 0
  _activePageSize: number = 25
  _orderByDesc: boolean = false
  _totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  _searchString: string = ""
  get queryParams(): PagedQueryRequest {
    return {
      Page: this._activePageIndex + 1,
      OrderBy: this._activeSort,
      OrderByDesc: this._orderByDesc,
      PageSize: 10000, // Ez this._activePageSize,
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

  setGridData() {
    console.log(this.data)
    this.gridApi.setGridOption("rowData", this.data);
    this.gridApi.setGridOption("columnDefs", this.colDefs);
    this.gridApi.setGridOption("paginationPageSize", this._activePageSize);
  }

  onGridReady(params: GridReadyEvent<GasTransaction>) {
    // console.log("onGridReady: ", params)
    this.gridApi = params.api;
  }

  //#region Lifecycle

  async ngAfterViewInit() {
    // this.sort.active = this._activeSort
    // this.sort.direction = this._orderByDesc ? "desc" : "asc"

    // this.filter.valueChanges.pipe(debounceTime(250)).subscribe(newValue => {
    //   this._searchString = newValue ?? ""
    //   this.RefreshData()
    // })

    await this.RefreshData()
  }

  // clearFilter(): void {
  //   this.filter.setValue("")
  // }

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
        this.data = data?.Value?.Data ?? []
        if (data?.Value?.Columns) {
          this.gridModel = GridModel.FromColumnDatas(data.Value.Columns)
          this.gridModel.Columns.forEach((element, index) => {
            this.colDefs.push({
              field: element.ColKey,
              
              headerName: element.Title,
              
              filter: ColumnTypeToAgFilter[element.ColumnType],
              floatingFilter: true,

              headerCheckboxSelection: index == 0 ? true : false,
              checkboxSelection: index == 0 ? true : false,

              valueFormatter: this.GetValueFormatter(element)
            } as ColDef);
          });
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

  private GetValueFormatter(element: ColumnModel) {
    switch (element.ColumnType) {
      case ColumnTypes.number:
        return (params: any) => {
          //console.log(params)
          return params.value?.toFixed(2).toString().replace('.', ',')
        }
      case ColumnTypes.date:
        return (params: any) => {
          //console.log(params)
          //return moment(params.value).locale('fr-FR').toString()
          return moment(params.value).format('DD/M/yyyy hh:mm')
          //return params.value?.toFixed(2)
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
      if (result) {
        const importRef = this.dialog.open(ImportGasTransactionsDialogComponent)
        importRef.afterClosed().subscribe(result => {
          this.RefreshData()
        })
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
        const importRef = this.dialog.open(ProcessBlobFilesDialogComponent)
        importRef.afterClosed().subscribe(result => {
          this.RefreshData()
        })
      }
    })
  }

  //#endregion

  //#region Grid events

  onPaginationChanged(event: any) {
    //console.log("onPaginationPageLoaded: ", event);
  }

  /*
  selectRows() {
    var sortedData = this.dataSource.sortData(this.dataSource.data, this.sort)
    for (let index = this.dataSource.paginator!.pageIndex * this.dataSource.paginator!.pageSize;
         index < (this.dataSource.paginator!.pageIndex + 1) * this.dataSource.paginator!.pageSize;
         index++
    ) {
      this.selection.select(sortedData[index]);
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

  async sortChange(sortState: Sort) {
    this.selection.clear()

    this._activeSort = sortState.active ?? this._defaultSort
    this._orderByDesc = sortState.direction == 'desc'
    
    await this.RefreshData()
  }

  pageChanged(event: PageEvent): void {
    this.selection.clear()

    this._activePageIndex = event.pageIndex
    this._activePageSize = event.pageSize

    this.RefreshData()
  }
  */

  //#endregion
}