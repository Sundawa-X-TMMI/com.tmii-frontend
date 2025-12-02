import type { Row } from "@tanstack/table-core";
import { Delete, MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/features/transaction/hooks/use-transaction-queries";
import { TransactionTypes } from "@/types/features/transaction.type";

interface TransactionTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function TransactionTableRowActions<TData>({
                                                    row,
                                                  }: TransactionTableRowActionsProps<TData>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const original = row.original as TransactionTypes.Service.TransactionData;

  const onUpdate = (values: unknown) => {
    updateTransaction.mutate({
      id: original.id,
      payload: values as TransactionTypes.Service.UpdateTransactionRequest,
    });
    setEditOpen(false);
  };

  const onDelete = () => {
    deleteTransaction.mutate(original.id);
    setDeleteOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <MoreHorizontal />
            <span className="sr-only">Open Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil size={20} /> <span>Sunting</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Delete size={20} color="red" /> <span>Hapus</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        title="Hapus Transaksi"
        description={`Apakah Anda yakin ingin menghapus transaksi "${original.transactionId}"?`}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={onDelete}
        loading={deleteTransaction.isPending}
      />
    </>
  );
}