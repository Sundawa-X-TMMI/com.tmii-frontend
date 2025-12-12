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
import {useProduct} from "@/features/product/hooks/product-queries";
import {ProductTypes} from "@/types/features/product.type";
import {merchantProductColumns} from "@/features/product/components/merchant-product-columns";
import {MerchantProductTableToolbar} from "@/features/product/components/merchant-product-table-toolbar";

interface MerchantProductTableProps {
  merchantId: string;
  merchantName: string;
}

export function MerchantProductTable({merchantId, merchantName}: MerchantProductTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const queryParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
    sortBy: sorting[0]?.id ?? "createdAt",
    direction: (sorting[0]?.desc ? QueryDirection.DESC : QueryDirection.ASC) as "ASC" | "DESC",
    search: merchantName,
  }), [pagination.pageIndex, pagination.pageSize, sorting, merchantName]);

  const { data, isLoading, isError } = useProduct(queryParams);

  const productData = useMemo(() => {
    const allProducts = (data?.data as Query.Pagination<ProductTypes.Service.ProductData>)?.items ?? [];
    const filteredProducts = allProducts.filter(
      (product) => product.merchantName === merchantName
    );

    if (search) {
      return filteredProducts.filter((product) =>
        product.productName.toLowerCase().includes(search.toLowerCase()) ||
        product.price.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filteredProducts;
  }, [data, merchantName, search]);

  const totalCount = productData.length;

  const table = useReactTable({
    data: productData,
    columns: merchantProductColumns,
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
    manualPagination: false,
    manualSorting: false,
  });

  return (
    <div className="space-y-4">
      <MerchantProductTableToolbar
        table={table}
        search={search}
        setSearch={setSearch}
        merchantName={merchantName}
      />
      <DataGrid
        table={table}
        columnsLength={merchantProductColumns.length}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}