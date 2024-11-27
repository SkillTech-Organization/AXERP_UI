import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ColumnModel, ColumnTypes, ColumnTypeToAgFilter, GridModel } from '../../../../util/models/GridModel';
import { PagedQueryRequest } from '../../../../util/models/PagedQueryRequest';
import {
  ColDef,
  DomLayoutType,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import moment from 'moment';
import { HelperFunctions } from '../../../../util/HelperFunctions';
import { ColumnData } from '../../../../util/models/ColumnData';

@Component({
  selector: 'app-base-grid-view',
  standalone: true,
  imports: [],
  template: '',
  styleUrls: []
})
export class BaseGridViewComponent<T> {
  protected gridApi!: GridApi<T>;

  gridDiv = document.querySelector<HTMLElement>("#transactionsGrid")!;

  loading: boolean = true
  operationIsInProgress: boolean = false

  gridModel: GridModel = new GridModel([])
  selection: SelectionModel<T>
  domLayout: DomLayoutType = "normal";

  data: T[] = []
  colDefs: ColDef[] = []

  readonly dialog = inject(MatDialog);

  _defaultSort: string = ''
  _activeColumns: string = '' // 'DeliveryID,DateLoadedEnd,DateDelivered,SalesContractID,QtyLoaded,Sales,Terminal'
  _activeSort: string = ""
  _activePageIndex: number = 0
  _activePageSize: number = 10
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

  constructor() {
    const initialSelection: any[] = []
    const allowMultiSelect = false
    this.selection = new SelectionModel<T>(allowMultiSelect, initialSelection)
  }

  public ProcessColumnData(cols: ColumnData[]): void {
    this.gridModel = GridModel.FromColumnDatas(cols)
    this.colDefs = []
    HelperFunctions.OrderBy(this.gridModel.Columns, 'Order', 0).forEach((element, index) => {
      this.colDefs.push({
        field: element.ColKey,

        headerName: element.Title,

        filter: ColumnTypeToAgFilter[element.ColumnType],
        floatingFilter: true,

        headerCheckboxSelection: index == 0 ? true : false,
        checkboxSelection: index == 0 ? true : false,

        valueFormatter: this.GetValueFormatter(element),

        minWidth: element.MinWidth,
        maxWidth: element.MaxWidth,

        width: (element.MinWidth && element.MaxWidth) ? undefined : 1000
      } as ColDef)
    })
  }

  setGridData() {
    this.gridApi.setGridOption("rowData", this.data);
    this.gridApi.setGridOption("columnDefs", this.colDefs);
    this.gridApi.setGridOption("paginationPageSize", this._activePageSize);
  }

  GetValueFormatter(element: ColumnModel) {
    switch (element.ColumnType) {
      case ColumnTypes.number:
        return (params: any) => {
          return params.value?.toFixed(2).toString().replace('.', ',')
        }
      case ColumnTypes.date:
        return (params: any) => {
          if (params.value) {
            return moment(params.value).format('DD/M/yyyy hh:mm')
          } else {
            return undefined
          }
        }
    }
    return undefined
  }

  //#region Grid events

  onGridReady(params: GridReadyEvent<T>) {
    this.gridApi = params.api;
  }

  onPaginationChanged(event: any) {
    //console.log("onPaginationPageLoaded: ", event);
  }

  onRowSelected(event: any) {
    //console.log("onRowSelected: ", event, this.SelectedIds)
  }

  //#endregion
}
