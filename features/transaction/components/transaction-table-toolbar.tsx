import type { Table } from "@tanstack/table-core";
import { CalendarIcon, Download, Filter, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TransactionTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  setSearch: (value: string) => void;
}

export function TransactionTableToolbar<TData>({
                                                 table,
                                                 search,
                                                 setSearch,
                                               }: TransactionTableToolbarProps<TData>) {
  const [date, setDate] = useState<Date>();
  const [openStatusFilter, setOpenStatusFilter] = useState(false);

  const statusOptions = [
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Failed", value: "failed" },
  ];

  const statusColumn = table.getColumn("status");
  const selectedStatus = statusColumn?.getFilterValue() as string[] || [];

  const handleStatusChange = (status: string, checked: boolean) => {
    if (!statusColumn) return;

    const current = [...selectedStatus];

    if (checked) {
      statusColumn.setFilterValue([...current, status]);
    } else {
      statusColumn.setFilterValue(current.filter(s => s !== status));
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const dateColumn = table.getColumn("date");
      if (dateColumn) {
        dateColumn.setFilterValue(format(selectedDate, "yyyy-MM-dd"));
      }
    } else {
      const dateColumn = table.getColumn("date");
      if (dateColumn) {
        dateColumn.setFilterValue(undefined);
      }
    }
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const isFiltered = search || date || selectedStatus.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters Row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full lg:w-[300px]"
            />
          </div>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Status Filter Dropdown - hanya jika kolom status ada */}
          {statusColumn && (
            <DropdownMenu open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                  {selectedStatus.length > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {selectedStatus.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={selectedStatus.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleStatusChange(option.value, checked as boolean)
                    }
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Reset Filters Button */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setDate(undefined);
                statusColumn?.setFilterValue([]);
              }}
              className="h-10 px-3 lg:px-4"
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Export Button */}
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}