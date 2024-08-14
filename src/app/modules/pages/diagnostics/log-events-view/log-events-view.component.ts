import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AgGridAngular } from "ag-grid-angular";
import moment from "moment";
import { BehaviorSubject } from "rxjs";
import { GridModel, ColumnTypeToAgFilter, ColumnModel, ColumnTypes } from "../../../../util/models/GridModel";
import { PagedQueryRequest } from "../../../../util/models/PagedQueryRequest";
import { MockService } from "../../../services/mock.service";
import { ToastService } from "../../../services/toast.service";
import { ManagerButtonComponent } from "../../../shared/buttons/manager-button/manager-button.component";
import {
    ColDef,
    GridApi,
    GridReadyEvent,
    FilterModel
  } from "ag-grid-community";
import { LogEventsService } from "../services/log-events.service";
import { ILogEvent } from "../models/LogEvent";

@Component({
  selector: 'app-log-events-view',
  templateUrl: './log-events-view.component.html',
  styleUrl: './log-events-view.component.scss',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, 
    MatCardModule, MatButtonModule,
    MatCheckboxModule, MatDividerModule, MatIconModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatProgressSpinner,
    AgGridAngular, ManagerButtonComponent,
    MatInput, MatFormField, MatLabel
  ],
  providers: [MockService]
})
export class EventLogViewComponent implements AfterViewInit {
  private gridApi!: GridApi<ILogEvent>;

  gridDiv = document.querySelector<HTMLElement>("#appInsightsGrid")!;

  loading: boolean = true
  operationIsInProgress: boolean = false

  gridModel: GridModel = new GridModel([])
  selection: SelectionModel<ILogEvent>

  data: ILogEvent[] = []
  colDefs: ColDef[] = []

  readonly dialog = inject(MatDialog);

  _defaultSort: string = 'When'
  _activeColumns: string = ''
  _activeSort: string = this._defaultSort
  _activePageIndex: number = 1
  _activePageSize: number = 100
  _orderByDesc: boolean = true
  get _allPages(): number {
    return Math.round(this._totalCount$.value / this._activePageSize)
  }
  _totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  _searchString: string = ""
  get queryParams(): PagedQueryRequest {
    return {
      Page: this._activePageIndex + 1,
      OrderBy: this._activeSort,
      OrderByDesc: this._orderByDesc,
      PageSize: this._activePageSize,
    } as PagedQueryRequest
  }

  get SelectedIds(): number[] {
    if (!this.gridApi) {
      return []
    }
    return this.gridApi.getSelectedRows().map(x => x.ProcessId)
  }

  get CanPageBack(): boolean {
    return this._activePageIndex > 1
  }

  get HasMorePages(): boolean {
    return this._totalCount$.value > this._activePageIndex * this._activePageSize
  }

  get CurrentFilter(): FilterModel | undefined {
    if (!this.gridApi) {
      return undefined
    }
    return this.gridApi.getFilterModel()
  }

  get DisableManagerButtons(): boolean {
    return this.operationIsInProgress || this.loading
  }

  constructor(
    private appInsightsService: LogEventsService,
    private snackService: ToastService
  ) {
    const initialSelection: any[] = []
    const allowMultiSelect = false
    this.selection = new SelectionModel<ILogEvent>(allowMultiSelect, initialSelection)
  }

  setGridData() {
    this.gridApi.setGridOption("rowData", this.data);
    this.gridApi.setGridOption("columnDefs", this.colDefs);
    this.gridApi.setGridOption("paginationPageSize", this._activePageSize);
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

      const data = await this.appInsightsService.QueryLogEvents(this.queryParams)

      if (!data.Value?.IsSuccess) {
        this.snackService.openError(data.Value?.RequestError ?? "Request (QueryIAppInsightsEntry) failed.")
      }
      else if (data) {
        this.data = data?.Value?.Data ?? []
        if (data?.Value?.Columns) {
          this.gridModel = GridModel.FromColumnDatas(data.Value.Columns)
          this.colDefs = []
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
          return params.value?.toFixed(2).toString().replace('.', ',')
        }
      case ColumnTypes.date:
        return (params: any) => {
          return moment(params.value).format('DD/M/yyyy hh:mm')
        }
    }
    return undefined
  }

  pageBack(): void {
    if (this.CanPageBack) {
      this._activePageIndex -= 1
      this.RefreshData()
    }
  }

  pageNext(): void {
    console.log(this.gridApi.getFilterModel())
    if (this.HasMorePages) {
      this._activePageIndex += 1
      this.RefreshData()
    }
  }

//   public ImportGasTransactions(): void {
//     const ref = this.dialog.open(ConfirmationDialogComponent, {
//       data: {
//         title: "Confirmation",
//         message: "Are you sure you want to import the Gas Transactions?"
//       }
//     })
//     ref.afterClosed().subscribe(result => {
//       try {
//         this.operationIsInProgress = true
//         if (result) {
//           const dialogRef = this.dialog.open(ImportGasTransactionsDialogComponent)
//           dialogRef.afterClosed().subscribe(result => {
//             this.operationIsInProgress = false
//             this.RefreshData()
//           })
//         }
//       } catch (error: any) {
//         this.operationIsInProgress = false
//         this.snackService.openError(error.message)
//       }
//     })
//   }

  //#endregion

  //#region Grid events

  onGridReady(params: GridReadyEvent<ILogEvent>) {
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