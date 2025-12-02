"use client";
import {useReactTable} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
} from "@tanstack/table-core";
import {useMemo, useState} from "react";
import {DataGrid} from "@/components/data-grid";
import {type Query, QueryDirection} from "@/types/lib/query.type";
import {useWahana} from "@/features/wahana/hooks/wahana-queries";
import {WahanaTableToolbar} from "@/features/wahana/components/wahana-table-toolbar";
import {wahanaColumns} from "@/features/wahana/components/wahana-columns";
import {WahanaTypes} from "@/types/features/wahana.type";

export function WahanaTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const queryParams = useMemo(() => {
    const sortBy = sorting[0]?.id ?? "createdAt";
    const direction = sorting[0]?.desc
      ? QueryDirection.DESC
      : QueryDirection.ASC;

    return {
      page: pagination.pageIndex + 1,
      itemPerPage: pagination.pageSize,
      sortBy,
      direction,
      search,
    };
  }, [pagination, sorting, search]);

  const { data, isLoading, isError } = useWahana(queryParams);
  const wahanaData =
    (data?.data as Query.Pagination<WahanaTypes.Service.WahanaData>)?.items ?? [];
  const totalCount =
    (data?.data as Query.Pagination<WahanaTypes.Service.WahanaData>)?.count ?? 0;

  const table = useReactTable({
    data: wahanaData,
    columns: wahanaColumns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-4">
      <WahanaTableToolbar table={table} search={search} setSearch={setSearch} />
      <DataGrid
        table={table}
        columnsLength={wahanaColumns.length}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
