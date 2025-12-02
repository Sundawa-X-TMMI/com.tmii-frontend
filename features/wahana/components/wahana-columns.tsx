import type {ColumnDef} from "@tanstack/table-core";
import {format} from "date-fns";
import {DataTableColumnHeader} from "@/components/ui/data-table-column-header";
import type {WahanaTypes} from "@/types/features/wahana.type";
import WahanaTableRowActions from "@/features/wahana/components/wahana-table-row-actions";

export const wahanaColumns: ColumnDef<WahanaTypes.Service.WahanaData>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("name")}
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
    cell: ({ row }) => <WahanaTableRowActions row={row} />,
  },
];
