import { CommonModule } from "@angular/common";
import { Component, AfterViewInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AgGridAngular } from "ag-grid-angular";
import moment from "moment";
import { GridModel, ColumnTypeToAgFilter, ColumnModel, ColumnTypes } from "../../../../util/models/GridModel";
import { PagedQueryRequest } from "../../../../util/models/PagedQueryRequest";
import { MockService } from "../../../services/mock.service";
import { ToastService } from "../../../services/toast.service";
import { ManagerButtonComponent } from "../../../shared/buttons/manager-button/manager-button.component";
import {
    ColDef,
    FilterModel  } from "ag-grid-community";
import { LogEventsService } from "../services/log-events.service";
import { ILogEvent } from "../models/LogEvent";
import { SimplePaginator } from "../../../../util/managers/SimplePaginator";
import { BaseGridViewComponent } from "../../../shared/pages/base-grid-view/base-grid-view.component";
import { HelperFunctions } from "../../../../util/HelperFunctions";
import { ColumnData } from "../../../../util/models/ColumnData";

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
export class EventLogViewComponent extends BaseGridViewComponent<ILogEvent> implements AfterViewInit {
  override gridDiv = document.querySelector<HTMLElement>("#appInsightsGrid")!;
  override _defaultSort: string = 'When'
  override get queryParams(): PagedQueryRequest {
    return {
      Page: this.paginator.PageIndex,
      OrderBy: this._activeSort,
      OrderByDesc: this._orderByDesc,
      PageSize: this.paginator.PageSize,
    } as PagedQueryRequest
  }

  paginator: SimplePaginator = new SimplePaginator(1, 100, 0)

  get SelectedIds(): number[] {
    if (!this.gridApi) {
      return []
    }
    return this.gridApi.getSelectedRows().filter(x => x.ProcessId !== undefined).map(x => x.ProcessId!)
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
    super()
    this._activeSort = this._defaultSort
    this._orderByDesc = true
    this.paginator.PaginationChanged.subscribe(event => {
      this.RefreshData()
    })
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
          this.ProcessColumnData(data?.Value?.Columns)
        }
        this.paginator.TotalCount = data.Value?.TotalCount ?? 0
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

  private GetMinWidthForCol(element: ColumnModel) {
    if (element.ColKey == "ProcessId") {
      return 250
    }
    if (element.ColKey == "Description") {
      return 1000
    }
    return 100
  }

  override GetValueFormatter(element: ColumnModel) {
    switch (element.ColumnType) {
      case ColumnTypes.number:
        return (params: any) => {
          if (params.value && params.value.toString().includes(',') || params.value.toString().includes('.')) {
            return params.value?.toFixed(2).toString().replace('.', ',')
          } else {
            return params.value
          }
        }
      case ColumnTypes.date:
        return (params: any) => {
          return moment(params.value).format('DD/M/yyyy hh:mm')
        }
    }
    return undefined
  }

  //#endregion
}