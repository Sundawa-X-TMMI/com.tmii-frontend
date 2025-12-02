import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema untuk create transaction
const createSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID harus diisi").max(50, "Transaction ID terlalu panjang"),
  merchantId: z.string().min(1, "Merchant ID harus diisi").max(50, "Merchant ID terlalu panjang"),
  merchantName: z.string().min(1, "Merchant Name harus diisi").max(100, "Merchant Name terlalu panjang"),
  product: z.string().min(1, "Product harus diisi").max(200, "Product terlalu panjang"),
  price: z.coerce.number().min(1, "Price harus lebih dari 0"),
  quantity: z.coerce.number().min(1, "Quantity minimal 1"),
  status: z.enum(["pending", "processing", "completed", "cancelled", "failed"]),
});

// Schema update transaction (cuma status yang bisa diupdate)
const updateSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "cancelled", "failed"]),
});

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;
type FormValues = CreateFormValues | UpdateFormValues;

interface TransactionFormDialogProps {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLabel?: string;
}

export const TransactionFormDialog = ({
                                        defaultValues,
                                        onSubmit,
                                        open,
                                        setOpen,
                                        triggerLabel,
                                      }: TransactionFormDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(defaultValues ? updateSchema : createSchema),
    defaultValues: defaultValues ?? {
      transactionId: "",
      merchantId: "",
      merchantName: "",
      product: "",
      price: 0,
      quantity: 1,
      status: "pending",
    },
  });

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    setOpen(false);
    if (!defaultValues) {
      form.reset();
    }
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Failed", value: "failed" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Transaction" : "Create New Transaction"}
          </DialogTitle>
          <DialogDescription>
            {defaultValues
              ? "Edit existing transaction details."
              : "Add a new transaction to the system."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {!defaultValues ? (
              // Form untuk create (semua field)
              <>
                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID</FormLabel>
                      <FormControl>
                        <Input placeholder="TRX-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="merchantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant ID</FormLabel>
                        <FormControl>
                          <Input placeholder="MER001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="merchantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Toko Sejahtera" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (Rp)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25000"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              // Form untuk edit (hanya status)
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {defaultValues ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};