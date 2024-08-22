import { BaseResponse } from "../../../../../util/models/BaseResponse";


export interface ProcessBlobFilesResponse extends BaseResponse {
    Processed: string[];
    Errors: string[];
    Warnings: string[];
}