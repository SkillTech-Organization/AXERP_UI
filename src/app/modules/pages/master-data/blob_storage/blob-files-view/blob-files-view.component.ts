import { AfterViewInit, Component, inject } from '@angular/core';
import { MockService } from '../../../../services/mock.service';
import { ColumnModel, ColumnTypes, ColumnTypeToAgFilter, GridModel } from '../../../../../util/models/GridModel';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PagedQueryRequest } from '../../../../../util/models/PagedQueryRequest';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ToastService } from '../../../../services/toast.service';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import moment from 'moment';
import { ManagerButtonComponent } from '../../../../shared/buttons/manager-button/manager-button.component';
import { BlobFile } from '../models/BlobFile';
import { BlobStorageService } from '../services/blob-storage.service';
import { ConfirmationDialogComponent } from '../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DeleteBlobFilesRequest } from '../models/DeleteBlobFilesRequest';
import { DeleteBlobFilesDialogComponent } from '../dialogs/delete-blob-files-dialog/delete-blob-files-dialog.component';
import { UploadBlobFilesDialogComponent } from '../dialogs/upload-blob-files-dialog/upload-blob-files-dialog.component';

@Component({
  selector: 'app-blob-files-view',
  templateUrl: './blob-files-view.component.html',
  styleUrl: './blob-files-view.component.scss',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule,
    MatCardModule, MatButtonModule,
    MatCheckboxModule, MatDividerModule, MatIconModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatProgressSpinner,
    AgGridAngular, ManagerButtonComponent
  ],
  providers: [MockService]
})
export class BlobFilesViewComponent implements AfterViewInit {
  private gridApi!: GridApi<BlobFile>;

  gridDiv = document.querySelector<HTMLElement>("#transactionsGrid")!;

  loading: boolean = true
  operationIsInProgress: boolean = false

  gridModel: GridModel = new GridModel([])
  selection: SelectionModel<BlobFile>

  data: BlobFile[] = []
  colDefs: ColDef[] = []

  readonly dialog = inject(MatDialog);

  _defaultSort: string = 'FileName'
  _activeColumns: string = ''
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
      PageSize: 10000,
      Columns: this._activeColumns,
      Search: this._searchString
    } as PagedQueryRequest
  }

  get SelectedIds(): string[] {
    if (!this.gridApi) {
      return []
    }
    return this.gridApi.getSelectedRows().map(x => x.Folder + "/" + x.FileName)
  }

  get SelectedBlobFiles(): BlobFile[] {
    if (!this.gridApi) {
      return []
    }
    return this.gridApi.getSelectedRows().map(x => new BlobFile(x.FileName, x.Folder))
  }

  get DisableManagerButtons(): boolean {
    return this.operationIsInProgress || this.loading
  }

  constructor(
    private blobStorageService: BlobStorageService,
    private snackService: ToastService
  ) {
    const initialSelection: any[] = []
    const allowMultiSelect = false
    this.selection = new SelectionModel<BlobFile>(allowMultiSelect, initialSelection)
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

      const data = await this.blobStorageService.QueryBlobFiles(this.queryParams)

      if (!data.Value?.IsSuccess) {
        this.snackService.openError(data.Value?.RequestError ?? "Request (QueryGasTransactions) failed.")
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

              valueFormatter: this.GetValueFormatter(element),

              width: 1000
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

  public DeleteSelectedBlobFiles(): void {
    if (this.SelectedIds.length === 0) {
      this.snackService.openWarning("At least one row must be selected for delete")
      return
    }
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirmation",
        message: "Are you sure you want to delete the selected file(s)?"
      }
    })
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.operationIsInProgress = true
        try {
          const dialogRef = this.dialog.open(DeleteBlobFilesDialogComponent, {
            data: new DeleteBlobFilesRequest(this.SelectedBlobFiles)
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

  public UploadBlobFile(): void {
    this.operationIsInProgress = true
    try {
      const dialogRef = this.dialog.open(UploadBlobFilesDialogComponent, {
        //data: new DeleteBlobFilesRequest(this.SelectedBlobFiles)
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

  //#endregion

  //#region Grid events

  onGridReady(params: GridReadyEvent<BlobFile>) {
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