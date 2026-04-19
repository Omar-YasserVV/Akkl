import { PaginatedResponseDto } from '@app/common/dtos/PaginationDto/paginated-result.dto';

export function createPagination<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponseDto<T> {
  const lastPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      perPage: limit,
    },
  };
}
