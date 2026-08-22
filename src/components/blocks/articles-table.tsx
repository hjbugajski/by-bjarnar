'use client';

import { useMemo, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTable, type DataTableFeatures } from '@/components/ui/data-table';
import { useArticlesTableData } from '@/hooks/useArticlesTableData';
import type { PayloadArticlesCollection, PayloadArticlesTableBlock } from '@/payload/payload-types';
import { articleLinkProps } from '@/utils/article';
import { formatDate } from '@/utils/format';

const columnHelper = createColumnHelper<DataTableFeatures, PayloadArticlesCollection>();

interface TableState {
  pagination: { pageIndex: number; pageSize: number };
  sorting: { id: string; desc: boolean }[];
  search: string;
}

export function ArticlesTableBlock({
  titleColumn,
  siteColumn,
  publishedColumn,
  pageSize = '10',
  defaultSort,
  enableSearch = true,
  searchPlaceholder = 'Search articles...',
}: PayloadArticlesTableBlock) {
  const [tableState, setTableState] = useState<TableState>({
    pagination: { pageIndex: 0, pageSize: Number(pageSize || '10') },
    sorting: defaultSort?.field
      ? [{ id: defaultSort.field, desc: defaultSort.direction === 'desc' }]
      : [],
    search: '',
  });

  const searchFields = useMemo(() => {
    const fields: string[] = [];

    if (titleColumn?.searchable) {
      fields.push('title');
    }

    if (siteColumn?.searchable) {
      fields.push('urlMetadata.site');
    }

    if (publishedColumn?.searchable) {
      fields.push('published');
    }

    return fields;
  }, [titleColumn?.searchable, siteColumn?.searchable, publishedColumn?.searchable]);

  const sort = useMemo(() => {
    if (tableState.sorting.length === 0) {
      return undefined;
    }

    const sortObj = tableState.sorting[0];

    return `${sortObj.desc ? '-' : ''}${sortObj.id}`;
  }, [tableState.sorting]);

  const { data: queryData, isLoading } = useArticlesTableData({
    page: tableState.pagination.pageIndex + 1,
    limit: tableState.pagination.pageSize,
    sort,
    search: tableState.search || undefined,
    searchFields: tableState.search && searchFields.length > 0 ? searchFields : undefined,
  });
  const data = queryData?.docs || [];
  const totalCount = queryData?.totalDocs || 0;
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('title', {
          header: 'Title',
          enableSorting: !!titleColumn?.sortable,
          meta: {
            fullWidth: !!titleColumn?.fullWidth,
            alignment: titleColumn?.alignment || 'left',
            whitespace: titleColumn?.whitespace || 'normal',
          },
          cell: ({ getValue, row: { original } }) => (
            <Link {...articleLinkProps(original)}>{getValue()}</Link>
          ),
        }),
        columnHelper.accessor('urlMetadata.site', {
          header: 'Site',
          enableSorting: !!siteColumn?.sortable,
          meta: {
            fullWidth: !!siteColumn?.fullWidth,
            alignment: siteColumn?.alignment || 'left',
            whitespace: siteColumn?.whitespace || 'normal',
          },
          cell: ({ getValue }) => {
            const site = getValue();

            return site ? <span>{site}</span> : <span className="text-gold-8">—</span>;
          },
        }),
        columnHelper.accessor('published', {
          header: 'Published',
          enableSorting: !!publishedColumn?.sortable,
          meta: {
            fullWidth: !!publishedColumn?.fullWidth,
            alignment: publishedColumn?.alignment || 'left',
            whitespace: publishedColumn?.whitespace || 'normal',
          },
          cell: ({ getValue }) => {
            const published = getValue();

            return published ? (
              <time dateTime={published} className="tabular-nums">
                {formatDate(published)}
              </time>
            ) : (
              <span className="text-gold-8">—</span>
            );
          },
        }),
      ]),
    [titleColumn, siteColumn, publishedColumn],
  );

  const handlePaginationChange = (pagination: { pageIndex: number; pageSize: number }) => {
    setTableState((prev) => ({ ...prev, pagination }));
  };

  const handleSortingChange = (sorting: { id: string; desc: boolean }[]) => {
    setTableState((prev) => ({
      ...prev,
      sorting,
      pagination: { ...prev.pagination, pageIndex: 0 },
    }));
  };

  const handleSearchChange = (search: string) => {
    setTableState((prev) => ({
      ...prev,
      search,
      pagination: { ...prev.pagination, pageIndex: 0 },
    }));
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      totalCount={totalCount}
      isLoading={isLoading}
      enableSearch={!!enableSearch}
      searchPlaceholder={searchPlaceholder || 'Search articles...'}
      pagination={tableState.pagination}
      sorting={tableState.sorting}
      searchValue={tableState.search}
      onPaginationChange={handlePaginationChange}
      onSortingChange={handleSortingChange}
      onSearchChange={handleSearchChange}
    />
  );
}
