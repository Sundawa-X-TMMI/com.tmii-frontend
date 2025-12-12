import type {ColumnDef} from "@tanstack/table-core";
import {format} from "date-fns";
import {DataTableColumnHeader} from "@/components/ui/data-table-column-header";
import {MemberTableRowActions} from "@/features/member/components/member-table-row-actions";
import type {MemberTypes} from "@/types/features/member.type";

export const MemberColumns: ColumnDef<MemberTypes.Service.MemberData>[] = [
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
    cell: ({ row }) => <MemberTableRowActions row={row} />,
  },
];
