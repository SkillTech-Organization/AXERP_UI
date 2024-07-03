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
      new ColumnModel(true, "TransactionType", "TransactionType", ColumnTypes.string, "TransactionType sort"),
      new ColumnModel(true, "ID", "ID", ColumnTypes.string, "ID sort"),
      new ColumnModel(true, "TransactionStart", "TransactionStart", ColumnTypes.date, "TransactionStart rendezés", TextAligns.center),
      new ColumnModel(true, "TransactionComplete", "TransactionComplete", ColumnTypes.date, "TransactionComplete rendezés", TextAligns.center),
      new ColumnModel(true, "Location", "Location", ColumnTypes.string, "Location rendezés"),
      new ColumnModel(true, "Counterparty", "Counterparty", ColumnTypes.string, "Counterparty rendezés"),
      new ColumnModel(true, "GasType", "GasType", ColumnTypes.string, "GasType rendezés"),
      new ColumnModel(true, "UOM", "UOM", ColumnTypes.string, "UOM rendezés"),
      new ColumnModel(true, "QTYHHV", "QTYHHV", ColumnTypes.number, "QTYHHV rendezés"),
      new ColumnModel(true, "Comments", "Comments", ColumnTypes.string, "Comments rendezés"),
      new ColumnModel(true, "DocRef", "DocRef", ColumnTypes.string, "DocRef rendezés"),
      new ColumnModel(true, "DocRef2", "DocRef2", ColumnTypes.string, "DocRef2 rendezés"),
      new ColumnModel(true, "DocRef3", "DocRef3", ColumnTypes.string, "DocRef3 rendezés"),
      new ColumnModel(true, "ExternalID", "ExternalID", ColumnTypes.string, "ExternalID rendezés"),
    ]
  )
  dataSource = new MatTableDataSource<GasTransaction>([])
  selection: SelectionModel<GasTransaction>

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private mockService: MockService
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
    const data = await this.mockService.GetMockData()
    if (data) {
      this.dataSource.data = data
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

    this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.sort)
  }

  pageChanged(event: PageEvent): void {
    this.selection.clear()
  }

  //#endregion
}