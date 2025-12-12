import type {ColumnDef} from "@tanstack/table-core";
import {format} from "date-fns";
import {DataTableColumnHeader} from "@/components/ui/data-table-column-header";
import {ProductTypes} from "@/types/features/product.type";
import MerchantProductTableRowActions from "@/features/product/components/merchant-product-table-row-actions";

export const merchantProductColumns: ColumnDef<ProductTypes.Service.ProductData>[] = [
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
    accessorKey: "productName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Produk" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {row.getValue("productName")}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Harga" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      return (
        <span>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(Number(price))}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" />
    ),
    cell: ({ row }) => <MerchantProductTableRowActions row={row} />,
  },
];