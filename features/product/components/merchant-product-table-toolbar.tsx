import type {Table} from "@tanstack/table-core";
import {Plus, X} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {DataTableViewOptions} from "@/components/ui/data-table-view-options";
import {Input} from "@/components/ui/input";
import {ProductFormDialog} from "@/features/product/components/product-form-dialog";
import {ProductTypes} from "@/types/features/product.type";
import CreateProductRequest = ProductTypes.Service.CreateProductRequest;
import {useCreateProduct} from "@/features/product/hooks/product-queries";

interface MerchantProductTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  setSearch: (value: string) => void;
  merchantName: string;
}

export function MerchantProductTableToolbar<TData>({
                                                     table,
                                                     search,
                                                     setSearch,
                                                     merchantName,
                                                   }: MerchantProductTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateProduct();
  const isFiltered = search.length > 0;

  const onCreate = (values: unknown) => {
    mutation.mutate(values as CreateProductRequest);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari Produk ..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <DataTableViewOptions table={table} />
        <ProductFormDialog
          onSubmit={onCreate}
          open={open}
          setOpen={setOpen}
          triggerLabel={
            (
              <>
                <Plus className="mr-2 h-4 w-4" /> Tambah Produk
              </>
            ) as unknown as string
          }
          defaultValues={{
            merchantName: merchantName,
            productName: "",
            price: "",
          }}
          disableMerchantName={true}
        />
      </div>
    </div>
  );
}