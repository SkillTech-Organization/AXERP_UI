import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MockService } from '../../../services/mock.service';
import { PocData } from '../models/PocData';
import { ColumnModel, GridModel } from '../../../../util/models/GridModel';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-poc-manager',
  templateUrl: './poc-manager.component.html',
  styleUrl: './poc-manager.component.scss',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatCardModule, MatButtonModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatDividerModule, MatIconModule],
  providers: [MockService]
})
export class PocManagerComponent implements AfterViewInit {
  @ViewChild(MatSort, {static: true}) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  gridModel: GridModel = new GridModel(
    [
      new ColumnModel(true, "ID", "ID", "ID sort"),
      new ColumnModel(true, "Name", "Name", "Name sort"),
      new ColumnModel(true, "Category", "Category", "Category rendezés"),
      new ColumnModel(true, "DataA", "DataA", "DataA rendezés"),
      new ColumnModel(true, "DataB", "DataB", "DataB rendezés"),
      new ColumnModel(true, "DataC", "DataC", "DataC rendezés"),
      new ColumnModel(true, "DataD", "DataD", "DataD rendezés"),
      new ColumnModel(true, "DataE", "DataE", "DataE rendezés"),
      new ColumnModel(true, "DataF", "DataF", "DataF rendezés"),
      new ColumnModel(true, "DataG", "DataG", "DataG rendezés"),
      new ColumnModel(true, "DataH", "DataH", "DataH rendezés"),
      new ColumnModel(true, "DataI", "DataI", "DataI rendezés"),
      new ColumnModel(true, "DataJ", "DataJ", "DataJ rendezés"),
      new ColumnModel(true, "DataK", "DataK", "DataK rendezés"),
      new ColumnModel(true, "DataL", "DataL", "DataL rendezés"),
    ]
  )
  dataSource = new MatTableDataSource<PocData>([])
  selection: SelectionModel<PocData>

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private mockService: MockService
  ) {
    const initialSelection: any[] = []
    const allowMultiSelect = false
    this.selection = new SelectionModel<PocData>(allowMultiSelect, initialSelection)
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