export interface IResponse<T = any> {
    code: number;
    data?: T;
    msg: string;
}

export interface Paginator {
    page: number;
    limit: number;
}

export interface ListResponse {
    total: number;
    paginator: Paginator;
}