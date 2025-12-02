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
import {AnjunganTableToolbar} from "@/features/anjungan/components/anjungan-table-toolbar";
import {anjunganColumns} from "@/features/anjungan/components/anjungan-columns";
import {useAnjungan} from "@/features/anjungan/hooks/anjungan-queries";
import {AnjunganTypes} from "@/types/features/anjungan.type";

export function AnjunganTable() {
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

  const { data, isLoading, isError } = useAnjungan(queryParams);
  const anjunganData =
    (data?.data as Query.Pagination<AnjunganTypes.Service.AnjunganData>)?.items ?? [];
  const totalCount =
    (data?.data as Query.Pagination<AnjunganTypes.Service.AnjunganData>)?.count ?? 0;

  const table = useReactTable({
    data: anjunganData,
    columns: anjunganColumns,
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
      <AnjunganTableToolbar table={table} search={search} setSearch={setSearch} />
      <DataGrid
        table={table}
        columnsLength={anjunganColumns.length}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
