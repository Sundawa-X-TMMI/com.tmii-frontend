import type {ColumnDef} from "@tanstack/table-core";
import {format} from "date-fns";
import {DataTableColumnHeader} from "@/components/ui/data-table-column-header";
import {ProductTypes} from "@/types/features/product.type";
import ProductTableRowActions from "@/features/product/components/product-table-row-actions";

export const productColumns: ColumnDef<ProductTypes.Service.ProductData>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat Pada" />
    ),
    cell: ({ row }) => {
      return <span>{format(row.getValue("createdAt"), "yyyy-MM-dd")}</span>;
    },
  },
  {
    accessorKey: "merchantName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Merchant" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("merchantName")}
      </span>
    ),
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Produk" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("productName")}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Harga" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("price")}
      </span>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" />
    ),
    cell: ({ row }) => <ProductTableRowActions row={row} />,
  },
];
