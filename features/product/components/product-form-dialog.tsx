import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

const createSchema = z.object({
  merchantName: z.string().min(1, "Nama Merchant Harus Diisi").max(255, "Nama Terlalu Panjang"),
  productName: z.string().min(1, "Nama Produk Harus Diisi").max(255, "Nama Terlalu Panjang"),
  price: z.string().min(1, "Harga Harus Diisi").max(255, "Harga Terlalu Panjang"),
});

const updateSchema = z.object({
  merchantName: z.string().min(1, "Nama Merchant Harus Diisi"),
  productName: z.string().min(1, "Nama Produk Harus Diisi"),
  price: z.string().min(1, "Harga Harus Diisi"),
});

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;
type FormValues = CreateFormValues | UpdateFormValues;

interface ProductFormDialogProps {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLabel?: string;
  disableMerchantName?: boolean;
}

export const ProductFormDialog = ({
                                    defaultValues,
                                    onSubmit,
                                    open,
                                    setOpen,
                                    triggerLabel,
                                    disableMerchantName = false,
                                  }: ProductFormDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(defaultValues ? updateSchema : createSchema),
    defaultValues: defaultValues ?? {
      merchantName: "",
      productName:"",
      price:"",
    },
  });

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = (values: CreateFormValues | FormValues) => {
    onSubmit(values);
    setOpen(false);
    // Reset form only if it's a create form
    if (!defaultValues) {
      form.reset({
        merchantName: defaultValues?.merchantName || "",
        productName: "",
        price: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues && !disableMerchantName ? "Sunting Data Produk" : "Tambah Produk Baru"}
          </DialogTitle>
          <DialogDescription>
            {defaultValues && !disableMerchantName
              ? "Sunting Data Produk yang sudah ada."
              : "Tambah Produk baru ke daftar."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="merchantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Merchant</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Merchant"
                      {...field}
                      disabled={disableMerchantName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Produk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input placeholder="Harga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                {defaultValues && !disableMerchantName ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};