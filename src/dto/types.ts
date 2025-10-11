export interface PagedResponse<Type> {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    content: Type[],
}