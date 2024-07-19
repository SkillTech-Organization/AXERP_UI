export interface PagedQueryRequest {
    Page: number;
    PageSize: number;
    OrderBy: string;
    OrderDesc: boolean;
    Columns?: string;
    Search?: string;
}