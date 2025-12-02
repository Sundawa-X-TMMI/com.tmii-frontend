import type {Row} from "@tanstack/table-core";
import {Delete, MoreHorizontal, Pencil} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {useDeleteAnjungan, useUpdateAnjungan} from "@/features/anjungan/hooks/anjungan-queries";
import {AnjunganTypes} from "@/types/features/anjungan.type";
import AnjunganData = AnjunganTypes.Service.AnjunganData;
import UpdateAnjunganRequest = AnjunganTypes.Service.UpdateAnjunganRequest;
import {AnjunganFormDialog} from "@/features/anjungan/components/anjungan-form-dialog";

interface AnjunganTableRowActionsProps<TData> {
  row: Row<TData>;
}

function AnjunganTableRowActions<TData>({
  row,
}: AnjunganTableRowActionsProps<TData>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateAnjungan = useUpdateAnjungan();
  const deleteAnjungan = useDeleteAnjungan();

  const original = row.original as AnjunganData;

  const onUpdate = (values: unknown) => {
    updateAnjungan.mutate({
      id: original.id,
      payload: values as UpdateAnjunganRequest,
    });
    setEditOpen(false);
  };

  const onDelete = () => {
    deleteAnjungan.mutate(original.id);
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
      <AnjunganFormDialog
        defaultValues={{
          name: row.getValue("name"),
          price: row.getValue("price"),
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
        loading={deleteAnjungan.isPending}
      />
    </>
  );
}

export default AnjunganTableRowActions
