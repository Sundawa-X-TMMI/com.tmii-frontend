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
import {bankColumns} from "@/features/bank/components/bank-columns";
import {BankTableToolbar} from "@/features/bank/components/bank-table-toolbar";
import {BankTypes} from "@/types/features/bank.type";
import {useBank} from "@/features/bank/hooks/bank-queries";

export function BankTable() {
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

  const { data, isLoading, isError } = useBank(queryParams);
  const bankData =
    (data?.data as Query.Pagination<BankTypes.Service.BankData>)?.items ?? [];
  const totalCount =
    (data?.data as Query.Pagination<BankTypes.Service.BankData>)?.count ?? 0;

  const table = useReactTable({
    data: bankData,
    columns: bankColumns,
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
      <BankTableToolbar table={table} search={search} setSearch={setSearch} />
      <DataGrid
        table={table}
        columnsLength={bankColumns.length}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
