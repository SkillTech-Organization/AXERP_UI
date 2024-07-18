import { ColumnData } from "./ColumnData";

export interface BasePagedQueryResponse<T> {
    Data?: T[],
    Columns: ColumnData[],
    PageSize: number,
    PageIndex: number,
    TotalCount: number,
    DataCount: number
}