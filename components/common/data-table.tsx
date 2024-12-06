"use client";

import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataTableProps<TData, TValue> {
  searchKey: string;
  searchPlaceholder: string;
  showVisibility?: boolean;
  showFilterSelect?: boolean;
  filterColumnName?: string;
  filterDefault?: string;
  filters?: string[];
  inputClassName?: string;
  tableClassName?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  inputPlateMask?: boolean;
}

export function DataTable<TData, TValue>({
  searchKey,
  searchPlaceholder,
  showVisibility = false,
  showFilterSelect = false,
  filterColumnName,
  filterDefault,
  filters,
  inputClassName,
  tableClassName,
  columns,
  data,
  inputPlateMask,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="flex max-md-plus:flex-col-reverse md-plus:items-center items-end md:justify-between pb-4 gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            if (inputPlateMask) {
              let inputValue = event.target.value;

              inputValue = inputValue
                .replace(/[^a-zA-Z0-9]/g, "")
                .toUpperCase();

              if (inputValue.length <= 3) {
                inputValue = inputValue;
              } else if (inputValue.length <= 6) {
                inputValue = inputValue.replace(/(.{3})(.{0,3})/, "$1 $2");
              } else {
                inputValue = inputValue
                  .slice(0, 6)
                  .replace(/(.{3})(.{0,3})/, "$1 $2");
              }

              table.getColumn(searchKey)?.setFilterValue(inputValue);
            } else {
              table.getColumn(searchKey)?.setFilterValue(event.target.value);
            }
          }}
          className={cn("md-plus:max-w-sm", inputClassName)}
        />
        <div className="flex md:items-center sm:justify-end gap-3 w-full">
          {showVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("ml-auto h-12", !showVisibility && "hidden")}
                >
                  Columnas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="h-[250px]">
                <ScrollArea className="h-full">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showFilterSelect && (
            <Select
              value={
                (table
                  .getColumn(filterColumnName!)
                  ?.getFilterValue() as string) ?? filterDefault!
              }
              onValueChange={(value) =>
                table
                  .getColumn(filterColumnName!)
                  ?.setFilterValue(value === filterDefault! ? "" : value)
              }
            >
              <SelectTrigger
                className={cn(
                  "sm:w-[180px] h-12 w-full",
                  !showFilterSelect && "hidden",
                  inputClassName
                )}
              >
                <SelectValue
                  className="xs:w-[180px] w-full"
                  placeholder={`Filtrar por ${filterColumnName}`}
                />
              </SelectTrigger>
              <SelectContent>
                {filters?.map((item, i) => (
                  <SelectItem key={i} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className={cn("rounded-md border bg-background", tableClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
