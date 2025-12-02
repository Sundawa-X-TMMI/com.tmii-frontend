import type {Row} from "@tanstack/table-core";
import {Delete, MoreHorizontal, Pencil} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {useDeleteProduct, useUpdateProduct} from "@/features/product/hooks/product-queries";
import {ProductTypes} from "@/types/features/product.type";
import UpdateProductRequest = ProductTypes.Service.UpdateProductRequest;
import ProductData = ProductTypes.Service.ProductData;
import {ProductFormDialog} from "@/features/product/components/product-form-dialog";
import {useDeleteBank, useUpdateBank} from "@/features/bank/hooks/bank-queries";
import {BankTypes} from "@/types/features/bank.type";
import BankData = BankTypes.Service.BankData;
import UpdateBankRequest = BankTypes.Service.UpdateBankRequest;
import {BankFormDialog} from "@/features/bank/components/bank-form-dialog";

interface BankTableRowActionsProps<TData> {
  row: Row<TData>;
}

function ProductTableRowActions<TData>({
                                         row,
                                       }: BankTableRowActionsProps<TData>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateBank = useUpdateBank();
  const deleteBank = useDeleteBank();

  const original = row.original as BankData;

  const onUpdate = (values: unknown) => {
    updateBank.mutate({
      id: original.id,
      payload: values as UpdateBankRequest,
    });
    setEditOpen(false);
  };

  const onDelete = () => {
    deleteBank.mutate(original.id);
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
      <BankFormDialog
        defaultValues={{
          name: row.getValue("name"),
          accountNumber: row.getValue("accountNumber"),
        }}
        onSubmit={onUpdate}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <ConfirmDialog
        title="Hapus Data"
        description={`Apakah Anda yakin ingin menghapus "${original.name}"?`}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={onDelete}
        loading={deleteBank.isPending}
      />
    </>
  );
}

export default ProductTableRowActions
