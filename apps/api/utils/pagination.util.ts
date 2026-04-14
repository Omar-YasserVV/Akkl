import { PaginatedResultDto } from '@app/common/dtos/PaginationDto/paginated-result.dto';

export function createPagination<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResultDto<T> {
  const lastPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      perPage: limit,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
    },
  };
}
