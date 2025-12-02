import type {ColumnDef} from "@tanstack/table-core";
import {format} from "date-fns";
import {DataTableColumnHeader} from "@/components/ui/data-table-column-header";
import BankTableRowActions from "@/features/bank/components/bank-table-row-actions";
import {BankTypes} from "@/types/features/bank.type";

export const bankColumns: ColumnDef<BankTypes.Service.BankData>[] = [
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
    accessorKey: "accountNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("accountNumber")}
      </span>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" />
    ),
    cell: ({ row }) => <BankTableRowActions row={row} />,
  },
];
