
import type {Row} from "@tanstack/table-core";
import {Delete, MoreHorizontal, Pencil} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useDeleteProduct, useUpdateProduct} from "@/features/product/hooks/product-queries";
import {ProductTypes} from "@/types/features/product.type";
import UpdateProductRequest = ProductTypes.Service.UpdateProductRequest;
import ProductData = ProductTypes.Service.ProductData;
import {ProductFormDialog} from "@/features/product/components/product-form-dialog";

interface MerchantProductTableRowActionsProps<TData> {
  row: Row<TData>;
}

function MerchantProductTableRowActions<TData>({
                                                 row,
                                               }: MerchantProductTableRowActionsProps<TData>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const original = row.original as ProductData;

  const onUpdate = (values: unknown) => {
    updateProduct.mutate({
      id: original.id,
      payload: values as UpdateProductRequest,
    });
    setEditOpen(false);
  };

  const onDelete = () => {
    deleteProduct.mutate(original.id);
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
      <ProductFormDialog
        defaultValues={{
          merchantName: original.merchantName,
          productName: row.getValue("productName"),
          price: row.getValue("price"),
        }}
        onSubmit={onUpdate}
        open={editOpen}
        setOpen={setEditOpen}
        disableMerchantName={true}
      />
      <ConfirmDialog
        title="Hapus Produk"
        description={`Apakah Anda yakin ingin menghapus produk "${original.productName}"?`}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={onDelete}
        loading={deleteProduct.isPending}
      />
    </>
  );
}

export default MerchantProductTableRowActions;