import type {ColumnDef} from "@tanstack/table-core";
import {format} from "date-fns";
import {DataTableColumnHeader} from "@/components/ui/data-table-column-header";
import {UserTableRowActions} from "@/features/user/components/user-table-row-actions";
import type {UserTypes} from "@/types/features/user.type";

export const userColumns: ColumnDef<UserTypes.Service.UserData>[] = [
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
    accessorKey: "lastLoginAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Terakhir Login Pada" />
    ),
    cell: ({ row }) =>
      row.getValue("lastLoginAt") != null ? (
        <span>{format(row.getValue("lastLoginAt"), "yyyy-MM-dd")}</span>
      ) : (
        <span>-</span>
      ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("name")}
        {/*({row.original.email})*/}
      </span>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" />
    ),
    cell: ({ row }) => <UserTableRowActions row={row} />,
  },
];
