import { BasePagedQueryResponse } from "./BasePagedQueryResponse";

export interface ApiResponse<T> {
    Value?: BasePagedQueryResponse<T>,
    Formatters: any[],
    ContentTypes: any[],
    DeclaredType: any[],
    StatusCode: number
}