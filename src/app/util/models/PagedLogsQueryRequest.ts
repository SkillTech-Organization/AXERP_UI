export interface PagedLogsQueryRequest {
    Page: number;
    PageSize: number;
    OrderBy: string;
    OrderByDesc: boolean;
    From: Date;
    To: Date;
}