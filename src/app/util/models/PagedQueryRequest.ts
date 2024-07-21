export interface PagedQueryRequest {
    Page: number;
    PageSize: number;
    OrderBy: string;
    OrderByDesc: boolean;
    Columns?: string;
    Search?: string;
}