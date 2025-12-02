"use client";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";
import { DataGrid } from "@/components/data-grid";
import { TransactionColumns } from "@/features/transaction/components/transaction-columns";
import { TransactionTableToolbar } from "@/features/transaction/components/transaction-table-toolbar";
import { useTransactions } from "@/features/transaction/hooks/use-transaction-queries";
import type { TransactionTypes } from "@/types/features/transaction.type";
import { type Query, QueryDirection } from "@/types/lib/query.type";

export function TransactionTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const queryParams = useMemo(() => {
    const sortBy = sorting[0]?.id ?? "date";
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

  const { data, isLoading, isError } = useTransactions(queryParams);

  const transactionData =
    (data?.data as Query.Pagination<TransactionTypes.Service.TransactionData>)?.items ?? [];

  const totalCount =
    (data?.data as Query.Pagination<TransactionTypes.Service.TransactionData>)?.count ?? 0;

  const table = useReactTable({
    data: transactionData,
    columns: TransactionColumns,
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
      <TransactionTableToolbar table={table} search={search} setSearch={setSearch} />
      <div className="rounded-md border">
        <DataGrid
          table={table}
          columnsLength={TransactionColumns.length}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}