import type { ColumnDef } from "@tanstack/table-core";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { TransactionTypes } from "@/types/features/transaction.type";

export const TransactionColumns: ColumnDef<TransactionTypes.Service.TransactionData>[] = [
  {
    accessorKey: "no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-center">
          {row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    size: 80,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {format(row.getValue("date"), "dd-MM-yyyy")}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "transactionId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction ID" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {row.getValue("transactionId")}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "merchantId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merchant ID" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("merchantId")}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue("product")}
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <div className="font-medium">
          Rp {price.toLocaleString('id-ID')}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("quantity")}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"));
      return (
        <div className="font-semibold text-green-600">
          Rp {total.toLocaleString('id-ID')}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
          case 'completed': return 'bg-green-100 text-green-800 border border-green-200';
          case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
          case 'processing': return 'bg-blue-100 text-blue-800 border border-blue-200';
          case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
          case 'failed': return 'bg-gray-100 text-gray-800 border border-gray-200';
          default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
      };

      const getStatusLabel = (status: string) => {
        if (!status) return '-';
        switch (status.toLowerCase()) {
          case 'completed': return 'Completed';
          case 'pending': return 'Pending';
          case 'processing': return 'Processing';
          case 'cancelled': return 'Cancelled';
          case 'failed': return 'Failed';
          default: return status.charAt(0).toUpperCase() + status.slice(1);
        }
      };

      return (
        <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(status)}`}>
          {getStatusLabel(status)}
        </div>
      );
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const rowValue = row.getValue(id) as string;
      return value.includes(rowValue?.toLowerCase());
    },
    size: 120,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    size: 100,
  },
];