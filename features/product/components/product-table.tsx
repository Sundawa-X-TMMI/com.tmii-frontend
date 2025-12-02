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
import {useProduct} from "@/features/product/hooks/product-queries";
import {ProductTypes} from "@/types/features/product.type";
import {productColumns} from "@/features/product/components/product-columns";
import {ProductTableToolbar} from "@/features/product/components/product-table-toolbar";

export function ProductTable() {
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

  const { data, isLoading, isError } = useProduct(queryParams);
  const productData =
    (data?.data as Query.Pagination<ProductTypes.Service.ProductData>)?.items ?? [];
  const totalCount =
    (data?.data as Query.Pagination<ProductTypes.Service.ProductData>)?.count ?? 0;

  const table = useReactTable({
    data: productData,
    columns: productColumns,
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
      <ProductTableToolbar table={table} search={search} setSearch={setSearch} />
      <DataGrid
        table={table}
        columnsLength={productColumns.length}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
