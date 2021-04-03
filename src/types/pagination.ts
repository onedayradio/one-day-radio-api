export interface Pagination {
  total: number
  perPage: number
  lastPage: number
  currentPage: number
  from: number
  to: number
}

export interface PaginationArg {
  total: number
  currentPage: number
  perPage: number
}
