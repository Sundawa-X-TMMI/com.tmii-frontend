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
import {userColumns} from "@/features/user/components/user-columns";
import {UserTableToolbar} from "@/features/user/components/user-table-toolbar";
import {useUsers} from "@/features/user/hooks/use-user-queries";
import type {UserTypes} from "@/types/features/user.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";

export function UserTable() {
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

  const { data, isLoading, isError } = useUsers(queryParams);
  const userData =
    (data?.data as Query.Pagination<UserTypes.Service.UserData>)?.items ?? [];
  const totalCount =
    (data?.data as Query.Pagination<UserTypes.Service.UserData>)?.count ?? 0;

  const table = useReactTable({
    data: userData,
    columns: userColumns,
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
      <UserTableToolbar table={table} search={search} setSearch={setSearch} />
      <DataGrid
        table={table}
        columnsLength={userColumns.length}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
