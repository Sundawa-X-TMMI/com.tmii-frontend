import type {Row} from "@tanstack/table-core";
import {Delete, MoreHorizontal, Pencil} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {MemberFormDialog} from "@/features/member/components/member-form-dialog";
import {useDeleteMember, useUpdateMember,} from "@/features/member/hooks/member-user-queries";
import {MemberTypes} from "@/types/features/member.type";
import MemberData = MemberTypes.Service.MemberData;
import UpdateMemberRequest = MemberTypes.Service.UpdateMemberRequest;

interface MemberTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function MemberTableRowActions<TData>({
  row,
}: MemberTableRowActionsProps<TData>) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const original = row.original as MemberData;

  const onUpdate = (values: unknown) => {
    updateMember.mutate({
      id: original.id,
      payload: values as UpdateMemberRequest,
    });
    setEditOpen(false);
  };

  const onDelete = () => {
    deleteMember.mutate(original.id);
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
      <MemberFormDialog
        defaultValues={{
          name: row.getValue("name"),
        }}
        onSubmit={onUpdate}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <ConfirmDialog
        title="Hapus Staf"
        description={`Apakah Anda yakin ingin menghapus "${original.name}"?`}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={onDelete}
        loading={deleteMember.isPending}
      />
    </>
  );
}
