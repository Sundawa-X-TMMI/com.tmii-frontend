import type {Table} from "@tanstack/table-core";
import {Plus, X} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {DataTableViewOptions} from "@/components/ui/data-table-view-options";
import {Input} from "@/components/ui/input";
import {MemberFormDialog} from "@/features/member/components/member-form-dialog";
import {MemberTypes} from "@/types/features/member.type";

import {useCreateMember} from "@/features/member/hooks/member-user-queries";
import CreateMemberRequest = MemberTypes.Service.CreateMemberRequest;

interface MemberTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  setSearch: (value: string) => void;
}

export function MemberTableToolbar<TData>({
  table,
  search,
  setSearch,
}: MemberTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateMember();
  const isFiltered = table.getState().columnFilters.length > 0;

  const onCreate = (values: unknown) => {
    mutation.mutate(values as CreateMemberRequest);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari Data ..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {(search || isFiltered) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              table.resetColumnFilters();
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
        <MemberFormDialog
          onSubmit={onCreate}
          open={open}
          setOpen={setOpen}
          triggerLabel={
            (
              <>
                <Plus className="ml-2 h-4 w-4" /> Buat Data Baru
              </>
            ) as unknown as string
          }
        />
      </div>
    </div>
  );
}
