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
  name: z.string().min(1, "Nama Harus Diisi").max(255, "Nama Terlalu Panjang"),
  price: z.string().min(1, "Harga Harus Diisi").max(255, "Harga Terlalu Panjang"),


});

const updateSchema = z.object({
  name: z.string().min(1, "Nama Harus Diisi"),
  price: z.string().min(1, "Harga Harus Diisi"),
});

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;
type FormValues = CreateFormValues | UpdateFormValues;

interface AnjunganFormDialogProps {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLabel?: string;
}

export const AnjunganFormDialog = ({
  defaultValues,
  onSubmit,
  open,
  setOpen,
  triggerLabel,
}: AnjunganFormDialogProps) => {
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(defaultValues ? updateSchema : createSchema),
    defaultValues: defaultValues ?? {
      name: "",
      price:"",
    },
  });

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = (values: CreateFormValues | FormValues) => {
    onSubmit(values);
    setOpen(false);
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
            {defaultValues ? "Sunting Data" : "Buat Data"}
          </DialogTitle>
          <DialogDescription>
            {defaultValues
              ? "Sunting Data yang sudah ada."
              : "Tambah Data baru ke daftar. "}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama" {...field} />
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
            <div className="flex justify-end">
              <Button type="submit">
                {defaultValues ? "Update" : "Kirim"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
