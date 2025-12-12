import {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Plus, Trash2} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {ProductFormDialog} from "@/features/product/components/product-form-dialog";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {useCreateProduct, useDeleteProduct} from "@/features/product/hooks/product-queries";
import {ProductTypes} from "@/types/features/product.type";
import CreateProductRequest = ProductTypes.Service.CreateProductRequest;

interface TenantProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tenantId: string;
  tenantName: string;
  products: ProductTypes.Service.ProductData[];
}

export const TenantProductModal = ({
                                     open,
                                     setOpen,
                                     tenantId,
                                     tenantName,
                                     products,
                                   }: TenantProductModalProps) => {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteProductName, setDeleteProductName] = useState<string>("");

  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const handleAddProduct = (values: unknown) => {
    const payload = values as CreateProductRequest;
    createProduct.mutate({
      ...payload,
      merchantName: tenantName,
    });
    setAddProductOpen(false);
  };

  const handleDeleteProduct = () => {
    if (deleteProductId) {
      deleteProduct.mutate(deleteProductId);
      setDeleteProductId(null);
      setDeleteProductName("");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Produk - {tenantName}</DialogTitle>
            <DialogDescription>
              Kelola produk untuk tenant ini
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setAddProductOpen(true)}
                size="sm"
                variant="default"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Tidak ada produk. Klik "Tambah Produk" untuk menambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(Number(product.price))}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeleteProductId(product.id);
                              setDeleteProductName(product.productName);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProductFormDialog
        onSubmit={handleAddProduct}
        open={addProductOpen}
        setOpen={setAddProductOpen}
        defaultValues={{
          merchantName: tenantName,
          productName: "",
          price: "",
        }}
        disableMerchantName={true}
      />

      <ConfirmDialog
        title="Hapus Produk"
        description={`Apakah Anda yakin ingin menghapus produk "${deleteProductName}"?`}
        open={!!deleteProductId}
        setOpen={(open) => {
          if (!open) {
            setDeleteProductId(null);
            setDeleteProductName("");
          }
        }}
        onConfirm={handleDeleteProduct}
        loading={deleteProduct.isPending}
      />
    </>
  );
};