import { BaseResponse } from "./BaseResponse";
import { ColumnData } from "./ColumnData";

export interface BasePagedQueryResponse<T> extends BaseResponse {
    Data?: T[],
    Columns: ColumnData[],
    PageSize: number,
    PageIndex: number,
    TotalCount: number,
    DataCount: number
}