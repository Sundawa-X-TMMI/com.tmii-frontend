import type {Row} from "@tanstack/table-core";
import {Delete, MoreHorizontal, Pencil} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {WahanaTypes} from "@/types/features/wahana.type";
import WahanaData = WahanaTypes.Service.WahanaData;
import UpdateWahanaRequest = WahanaTypes.Service.UpdateWahanaRequest;
import {WahanaFormDialog} from "@/features/wahana/components/wahana-form-dialog";
import {useDeleteWahana, useUpdateWahana} from "@/features/wahana/hooks/wahana-queries";
import {TenantFormDialog} from "@/features/tenant/components/tenant-form-dialog";
import {useDeleteTenant, useUpdateTenant} from "@/features/tenant/hooks/tenant-queries";

interface TenantTableRowActionsProps<TData> {
  row: Row<TData>;
}

function TenantTableRowActions<TData>({
  row,
}: TenantTableRowActionsProps<TData>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateTenant = useUpdateTenant();
  const deleteTenant = useDeleteTenant();

  const original = row.original as WahanaData;

  const onUpdate = (values: unknown) => {
    updateTenant.mutate({
      id: original.id,
      payload: values as UpdateWahanaRequest,
    });
    setEditOpen(false);
  };

  const onDelete = () => {
    deleteTenant.mutate(original.id);
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
      <TenantFormDialog
        defaultValues={{
          name: row.getValue("name")
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
        loading={deleteTenant.isPending}
      />
    </>
  );
}

export default TenantTableRowActions
