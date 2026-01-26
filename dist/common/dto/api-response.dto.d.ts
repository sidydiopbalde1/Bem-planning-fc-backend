export declare class PaginationMeta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}
export declare class ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    pagination?: PaginationMeta;
    timestamp: string;
}
export declare class ApiErrorResponse {
    success: boolean;
    statusCode: number;
    error: string;
    message: string | string[];
    timestamp: string;
}
export declare function createPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): ApiResponse<T[]>;
export declare function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T>;
