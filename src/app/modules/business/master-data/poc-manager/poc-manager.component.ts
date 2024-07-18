import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MockService } from '../../../services/mock.service';
import { GasTransaction } from '../models/GasTransaction';
import { ColumnModel, ColumnTypes, GridModel, TextAligns } from '../../../../util/models/GridModel';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GasTransactionService } from '../services/gas-transaction.service';
import { PagedQueryRequest } from '../../../../util/models/PagedQueryRequest';

@Component({
  selector: 'app-poc-manager',
  templateUrl: './poc-manager.component.html',
  styleUrl: './poc-manager.component.scss',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatTableModule, MatCardModule, MatButtonModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatDividerModule, MatIconModule],
  providers: [MockService]
})
export class PocManagerComponent implements AfterViewInit {
  @ViewChild(MatSort, {static: true}) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  gridModel: GridModel = new GridModel(
    [
      new ColumnModel(true, "DeliveryID", "DeliveryID", ColumnTypes.string, "DeliveryID sort"),
      new ColumnModel(true, "DateLoadedEnd", "DateLoadedEnd", ColumnTypes.date, "DateLoadedEnd sort", TextAligns.center),
      new ColumnModel(true, "DateDelivered", "DateDelivered", ColumnTypes.date, "DateDelivered rendezés", TextAligns.center),
      new ColumnModel(true, "SalesContractID", "SalesContractID", ColumnTypes.string, "SalesContractID rendezés"),
      new ColumnModel(true, "SalesStatus", "SalesStatus", ColumnTypes.string, "SalesStatus rendezés"),
      new ColumnModel(true, "Terminal", "Terminal", ColumnTypes.string, "Terminal rendezés"),
      new ColumnModel(true, "QtyLoaded", "QtyLoaded", ColumnTypes.number, "QtyLoaded rendezés", TextAligns.center),
      new ColumnModel(true, "ToDeliveryID", "ToDeliveryID", ColumnTypes.number, "ToDeliveryID rendezés", TextAligns.center),
      new ColumnModel(true, "Status", "Status", ColumnTypes.string, "Status rendezés"),
      new ColumnModel(true, "SpecificDeliveryPoint", "SpecificDeliveryPoint", ColumnTypes.string, "SpecificDeliveryPoint rendezés"),
      new ColumnModel(true, "DeliveryPoint", "DeliveryPoint", ColumnTypes.string, "DeliveryPoint rendezés"),
      new ColumnModel(true, "Transporter", "Transporter", ColumnTypes.string, "Transporter rendezés"),
      new ColumnModel(true, "DeliveryUP", "DeliveryUP", ColumnTypes.number, "DeliveryUP rendezés", TextAligns.center),
      new ColumnModel(true, "TransportCharges", "TransportCharges", ColumnTypes.number, "TransportCharges rendezés", TextAligns.center),
      new ColumnModel(true, "UnitSlotCharge", "UnitSlotCharge", ColumnTypes.number, "UnitSlotCharge sort", TextAligns.center),
      new ColumnModel(true, "ServiceCharges", "ServiceCharges", ColumnTypes.number, "ServiceCharges sort", TextAligns.center),
      new ColumnModel(true, "UnitStorageCharge", "UnitStorageCharge", ColumnTypes.number, "UnitStorageCharge rendezés", TextAligns.center),
      new ColumnModel(true, "StorageCharge", "StorageCharge", ColumnTypes.number, "StorageCharge rendezés", TextAligns.center),
      new ColumnModel(true, "OtherCharges", "OtherCharges", ColumnTypes.number, "OtherCharges rendezés"),
      new ColumnModel(true, "Sales", "Sales", ColumnTypes.number, "Sales rendezés", TextAligns.center),
      new ColumnModel(true, "CMR", "CMR", ColumnTypes.date, "CMR rendezés", TextAligns.center),
      new ColumnModel(true, "BioMWh", "BioMWh", ColumnTypes.number, "BioMWh rendezés", TextAligns.center),
      new ColumnModel(true, "BillOfLading", "BillOfLading", ColumnTypes.string, "BillOfLading rendezés"),
      new ColumnModel(true, "BioAddendum", "BioAddendum", ColumnTypes.string, "BioAddendum rendezés"),
      new ColumnModel(true, "Comment", "Comment", ColumnTypes.string, "Comment rendezés"),
      new ColumnModel(true, "CustomerNote", "CustomerNote", ColumnTypes.string, "CustomerNote rendezés"),
      new ColumnModel(true, "Customer", "Customer", ColumnTypes.string, "Customer rendezés"),
      new ColumnModel(true, "Reference", "Reference", ColumnTypes.string, "Reference rendezés"),
      new ColumnModel(true, "Reference2", "Reference2", ColumnTypes.string, "Reference2 rendezés"),
      new ColumnModel(true, "Reference3", "Reference3", ColumnTypes.string, "Reference3 rendezés"),
      new ColumnModel(true, "TruckLoadingCompanyComment", "TruckLoadingCompanyComment", ColumnTypes.string, "TruckLoadingCompanyComment rendezés"),
      new ColumnModel(true, "TruckCompany", "TruckCompany", ColumnTypes.string, "TruckCompany rendezés"),
    ]
  )
  dataSource = new MatTableDataSource<GasTransaction>([])
  selection: SelectionModel<GasTransaction>

  _defaultSort: string = 'DeliveryID'
  _activeSort: string = this._defaultSort
  _activePageIndex: number = 1
  _activePageSize: number = 5
  _orderDesc: boolean = false
  get queryParams(): PagedQueryRequest {
    return {
      Page: this._activePageIndex,
      OrderBy: this._activeSort,
      OrderDesc: this._orderDesc,
      PageSize: this._activePageSize
    } as PagedQueryRequest
  }

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private mockService: MockService,
    private gasTransactionService: GasTransactionService
  ) {
    const initialSelection: any[] = []
    const allowMultiSelect = false
    this.selection = new SelectionModel<GasTransaction>(allowMultiSelect, initialSelection)
  }

  //#region Lifecycle

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    await this.RefreshData()
  }

  //#endregion

  //#region Business

  private async RefreshData(): Promise<void> {
    const data = await this.gasTransactionService.QueryGasTransactions({
      Page: 5,
      OrderBy: 'DeliveryID',
      OrderDesc: false,
      PageSize: 25
    } as PagedQueryRequest)
    if (data) {
      this.dataSource.data = data?.Value?.Data ?? []
    }
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