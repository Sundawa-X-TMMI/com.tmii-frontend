import type {Row} from "@tanstack/table-core";
import {Delete, MoreHorizontal, Pencil} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {UserFormDialog} from "@/features/user/components/user-form-dialog";
import {useDeleteUser, useUpdateUser,} from "@/features/user/hooks/use-user-queries";
import {UserTypes} from "@/types/features/user.type";
import UserData = UserTypes.Service.UserData;
import UpdateUserRequest = UserTypes.Service.UpdateUserRequest;

interface UserTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function UserTableRowActions<TData>({
  row,
}: UserTableRowActionsProps<TData>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const original = row.original as UserData;

  const onUpdate = (values: unknown) => {
    updateUser.mutate({
      id: original.id,
      payload: values as UpdateUserRequest,
    });
    setEditOpen(false);
  };

  const onDelete = () => {
    deleteUser.mutate(original.id);
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
      <UserFormDialog
        defaultValues={{
          name: row.getValue("name"),
        }}
        onSubmit={onUpdate}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <ConfirmDialog
        title="Hapus Staf"
        description={`Apakah Anda yakin ingin menghapus staf "${original.name}"?`}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={onDelete}
        loading={deleteUser.isPending}
      />
    </>
  );
}
