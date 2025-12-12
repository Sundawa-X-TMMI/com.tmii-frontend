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
import {MemberColumns} from "@/features/member/components/member-columns";
import {MemberTableToolbar} from "@/features/member/components/member-table-toolbar";
import {useMembers} from "@/features/member/hooks/member-user-queries";
import type {MemberTypes} from "@/types/features/member.type";
import {type Query, QueryDirection} from "@/types/lib/query.type";

export function MemberTable() {
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

  const { data, isLoading, isError } = useMembers(queryParams);
  const memberData =
    (data?.data as Query.Pagination<MemberTypes.Service.MemberData>)?.items ?? [];
  const totalCount =
    (data?.data as Query.Pagination<MemberTypes.Service.MemberData>)?.count ?? 0;

  const table = useReactTable({
    data: memberData,
    columns: MemberColumns,
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
      <MemberTableToolbar table={table} search={search} setSearch={setSearch} />
      <DataGrid
        table={table}
        columnsLength={MemberColumns.length}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
