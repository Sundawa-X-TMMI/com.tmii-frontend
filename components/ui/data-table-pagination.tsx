import type { Table } from "@tanstack/table-core";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
                                             table,
                                           }: DataTablePaginationProps<TData>) {
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const total = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);
  const currentPage = pageIndex + 1;

  return (
    <div className="flex items-center justify-between px-2">
      {/* Showing info */}
      <div className="text-muted-foreground flex-1 text-sm">
        Showing {from}–{to} from {total} column.
      </div>

      <div className="flex items-center space-x-4">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 px-3"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        {/* Page numbers in format: 1,2,...,10 */}
        <div className="flex items-center text-sm">
          {/* Page 1 */}
          <Button
            variant={currentPage === 1 ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
          >
            1
          </Button>

          {/* Comma after page 1 */}
          <span className="mx-1">,</span>

          {/* Page 2 */}
          <Button
            variant={currentPage === 2 ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(1)}
          >
            2
          </Button>

          {/* Ellipsis if more than 5 pages */}
          {pageCount > 5 && (
            <>
              <span className="mx-1">,</span>
              <span className="px-2">...</span>
              <span className="mx-1">,</span>
            </>
          )}

          {/* Last page if different from 1 or 2 */}
          {pageCount > 2 && (
            <Button
              variant={currentPage === pageCount ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(pageCount - 1)}
            >
              {pageCount}
            </Button>
          )}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 px-3"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}