import { useQuery } from '@tanstack/react-query';

import type { PayloadArticlesCollection } from '@/payload/payload-types';

interface ArticlesTableParams {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  searchFields?: string[];
}

interface ArticlesTableResponse {
  docs: PayloadArticlesCollection[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

async function fetchArticlesTableData(params: ArticlesTableParams): Promise<ArticlesTableResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  if (params.search && params.searchFields?.length) {
    params.searchFields.forEach((field, index) => {
      searchParams.append(`where[or][${index}][${field}][contains]`, params.search || '');
    });
  }

  const response = await fetch(`/api/articles?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

interface UseArticlesTableDataProps {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  searchFields?: string[];
  enabled?: boolean;
}

export function useArticlesTableData({
  page,
  limit,
  sort,
  search,
  searchFields,
  enabled = true,
}: UseArticlesTableDataProps) {
  return useQuery({
    queryKey: ['articles-table', { page, limit, sort, search, searchFields }],
    queryFn: () => fetchArticlesTableData({ page, limit, sort, search, searchFields }),
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
