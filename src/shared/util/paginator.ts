import { Pagination, PaginationArg } from '../../types/pagination'

export const createPaginationObject = ({
  total,
  currentPage,
  perPage,
}: PaginationArg): Pagination => {
  const lastPage = Math.ceil(total / perPage)
  if (currentPage > lastPage) {
    currentPage = lastPage
  }
  const from = Math.max(0, currentPage - 1) * perPage
  const to = Math.min(from + perPage, total)

  return {
    total,
    perPage,
    lastPage,
    currentPage,
    from,
    to,
  }
}
