import { PaginatedResponseDto } from '@app/common/dtos/PaginationDto/paginated-result.dto';

export function createPagination<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponseDto<T> {
  return {
    data,
    meta: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    },
  };
}
