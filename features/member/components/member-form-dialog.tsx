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
  email: z
    .string()
    .email("Format email tidak valid")
    .min(1, "Email harus diisi")
    .max(255, "Email terlalu panjang"),
  username: z
    .string()
    .min(1, "Username harus diisi")
    .max(255, "Username terlalu panjang"),
  password: z
    .string()
    .min(1, "Password harus diisi")
    .max(255, "Password terlalu panjang"),
});

const updateSchema = z.object({
  name: z.string().min(1, "Nama Harus Diisi"),
});

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;
type FormValues = CreateFormValues | UpdateFormValues;

interface MemberFormDialogProps {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerLabel?: string;
}

export const MemberFormDialog = ({
  defaultValues,
  onSubmit,
  open,
  setOpen,
  triggerLabel,
}: MemberFormDialogProps) => {
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(defaultValues ? updateSchema : createSchema),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      username: "",
      password: "",
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
            {defaultValues ? "Sunting Member" : "Buat Member"}
          </DialogTitle>
          <DialogDescription>
            {defaultValues
              ? "Sunting Member yang sudah ada."
              : "Tambah Member baru ke daftar. "}
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
            {!defaultValues && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
