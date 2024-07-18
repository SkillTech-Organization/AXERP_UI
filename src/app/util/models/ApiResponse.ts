import { BasePagedQueryResponse } from "./BasePagedQueryResponse";

export interface ApiResponse<T> {
    Value?: T,
    Formatters: any[],
    ContentTypes: any[],
    DeclaredType: any[],
    StatusCode: number
}