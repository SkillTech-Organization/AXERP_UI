import { BaseResponse } from "../../../../util/models/BaseResponse";

export interface ImportGasTransactionResponse extends BaseResponse {
    TotalDataRowsInSheet: number;
    ImportedRows: number;
    InvalidRows: number;
    NewRows: number;
    UpdatedRows: number;
    DeletedRows: number;
    ImportErrors: string[];
}