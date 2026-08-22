'use client';

import { useEffect, useState } from 'react';

import { useDebouncedValue } from '@tanstack/react-pacer';
import {
  type CellData,
  type PaginationState,
  type RowData,
  type SortingState,
  type TableFeatures,
  type TableOptions,
  columnVisibilityFeature,
  flexRender,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Field, FieldControl } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { IconChevronDoubleLeft } from '@/icons/chevron-double-left';
import { IconChevronDoubleRight } from '@/icons/chevron-double-right';
import { IconChevronDownSmall } from '@/icons/chevron-down-small';
import { IconChevronGrabber } from '@/icons/chevron-grabber';
import { IconChevronLeft } from '@/icons/chevron-left';
import { IconChevronRight } from '@/icons/chevron-right';
import { IconChevronUpSmall } from '@/icons/chevron-up-small';
import { cn } from '@/utils/cn';

declare module '@tanstack/react-table' {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    /** Text alignment for the column */
    alignment?: 'left' | 'center' | 'right';
    /** Whether the cell should fill the available width */
    fullWidth?: boolean;
    /** Maximum width for the column */
    maxWidth?: number;
    /** Whether the cell should wrap text */
    whitespace?: 'normal' | 'nowrap';
  }
}

/**
 * Feature set backing every {@link DataTable}. Sorting and pagination are driven
 * manually by the caller, so neither needs a client-side row model; column
 * visibility supplies `row.getVisibleCells()`.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
});

export type DataTableFeatures = typeof dataTableFeatures;

export interface DataTableProps<T extends RowData> {
  data: T[];
  columns: TableOptions<DataTableFeatures, T>['columns'];
  totalCount: number;
  isLoading?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  pagination: PaginationState;
  sorting: SortingState;
  searchValue: string;
  onPaginationChange: (pagination: PaginationState) => void;
  onSortingChange: (sorting: SortingState) => void;
  onSearchChange: (search: string) => void;
}

export function DataTable<T extends RowData>({
  data,
  columns,
  totalCount,
  isLoading = false,
  enableSearch = true,
  searchPlaceholder = 'Search...',
  pagination,
  sorting,
  searchValue,
  onPaginationChange,
  onSortingChange,
  onSearchChange,
}: DataTableProps<T>) {
  const [searchInput, setSearchInput] = useState(searchValue);

  const [debouncedSearch] = useDebouncedValue(searchInput || '', { wait: 250 });

  useEffect(() => {
    if (debouncedSearch !== searchValue) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, searchValue, onSearchChange]);

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: true,
    manualSorting: true,
    state: { pagination, sorting },
    onPaginationChange: (updaterOrValue) => {
      const newPagination =
        typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;

      onPaginationChange(newPagination);
    },
    onSortingChange: (updaterOrValue) => {
      const newSorting =
        typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;

      onSortingChange(newSorting);
    },
  });

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const totalPages = Math.ceil(totalCount / pagination.pageSize);
  const currentPage = pagination.pageIndex + 1;
  const startRecord = pagination.pageIndex * pagination.pageSize + 1;
  const endRecord = Math.min(startRecord + pagination.pageSize - 1, totalCount);

  return (
    <div className="flex flex-col gap-2">
      {enableSearch ? (
        <div className="flex items-center gap-2">
          <Field className="w-full max-w-72">
            <FieldControl
              render={
                <Input
                  placeholder={searchPlaceholder}
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              }
            />
          </Field>
          {isLoading ? <Spinner /> : null}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-sm border border-gold-6">
        <table className="min-w-full">
          <thead className="border-b border-gold-6 bg-gold-3">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-3 py-2.5 text-xs font-medium text-gold-11',
                        header.column.getCanSort() && 'cursor-pointer select-none hover:bg-gold-4',
                        meta?.fullWidth && 'w-full min-w-0',
                        !meta?.fullWidth && 'w-auto',
                        meta?.alignment === 'center' && 'text-center',
                        meta?.alignment === 'right' && 'text-right',
                        meta?.alignment === 'left' && 'text-left',
                        meta?.fullWidth
                          ? 'whitespace-nowrap sm:whitespace-normal'
                          : meta?.whitespace === 'nowrap'
                            ? 'whitespace-nowrap'
                            : 'whitespace-normal',
                      )}
                      style={meta?.maxWidth ? { maxWidth: `${meta.maxWidth}px` } : undefined}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-between gap-1',
                          meta?.alignment === 'center' && 'justify-center',
                          meta?.alignment === 'right' && 'justify-end',
                          meta?.alignment === 'left' && 'justify-between',
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          header.column.getIsSorted() === 'asc' ? (
                            <IconChevronUpSmall className="-mr-1 size-4" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <IconChevronDownSmall className="-mr-1 size-4" />
                          ) : (
                            <IconChevronGrabber className="-mr-1 size-4 text-gold-10" />
                          )
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gold-6">
            {isLoading ? (
              <tr className="hover:bg-gold-3">
                <td colSpan={columns.length} className="px-2 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span className="text-gold-10">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gold-3">
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-3 py-2.5 text-sm text-gold-11',
                          meta?.fullWidth && 'w-full min-w-0',
                          !meta?.fullWidth && 'w-auto',
                          meta?.alignment === 'center' && 'text-center',
                          meta?.alignment === 'right' && 'text-right',
                          meta?.alignment === 'left' && 'text-left',
                          meta?.fullWidth
                            ? 'whitespace-nowrap sm:whitespace-normal'
                            : meta?.whitespace === 'nowrap'
                              ? 'whitespace-nowrap'
                              : 'whitespace-normal',
                        )}
                        style={meta?.maxWidth ? { maxWidth: `${meta.maxWidth}px` } : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr className="hover:bg-gold-3">
                <td colSpan={columns.length} className="px-2 py-3 text-center text-gold-10">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pl-2">
        <div className="text-sm text-gold-11">
          {totalCount > 0 ? startRecord : 0}&ndash;{endRecord} of {totalCount}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gold-11">
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              iconPosition="center"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <IconChevronDoubleLeft />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconPosition="center"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <IconChevronLeft />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconPosition="center"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <IconChevronRight />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconPosition="center"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <IconChevronDoubleRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
