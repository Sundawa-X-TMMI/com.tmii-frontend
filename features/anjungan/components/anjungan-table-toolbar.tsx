import type {Table} from "@tanstack/table-core";
import {Plus, X} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {DataTableViewOptions} from "@/components/ui/data-table-view-options";
import {Input} from "@/components/ui/input";
import {AnjunganFormDialog} from "@/features/anjungan/components/anjungan-form-dialog";
import {AnjunganTypes} from "@/types/features/anjungan.type";
import CreateAnjunganRequest = AnjunganTypes.Service.CreateAnjunganRequest;
import {useCreateAnjungan} from "@/features/anjungan/hooks/anjungan-queries";

interface AnjunganTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  setSearch: (value: string) => void;
}

export function AnjunganTableToolbar<TData>({
  table,
  search,
  setSearch,
}: AnjunganTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateAnjungan();
  const isFiltered = table.getState().columnFilters.length > 0;

  const onCreate = (values: unknown) => {
    mutation.mutate(values as CreateAnjunganRequest);
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
        <AnjunganFormDialog
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
