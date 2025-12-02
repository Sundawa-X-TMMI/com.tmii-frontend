import type {ColumnDef} from "@tanstack/table-core";
import {format} from "date-fns";
import {DataTableColumnHeader} from "@/components/ui/data-table-column-header";
import TenantTableRowActions from "@/features/tenant/components/tenant-table-row-actions";
import {TenantTypes} from "@/types/features/tenant.type";

export const tenantColumns: ColumnDef<TenantTypes.Service.TenantData>[] = [
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
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aksi" />
    ),
    cell: ({ row }) => <TenantTableRowActions row={row} />,
  },
];
