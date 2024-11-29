import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Column {
  key: string;
  label: string;
}

interface TableCardSkeletonProps {
  columns: Column[];
  rowCount?: number;
  inputPlaceholder: string;
}

export function TableCardSkeleton({
  columns,
  rowCount = 4,
  inputPlaceholder,
}: TableCardSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Input
          disabled
          className="opacity-50 md-plus:max-w-sm"
          placeholder={inputPlaceholder}
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell className="min-w-[180px]" key={column.key}>
                    {column.key === "placa" || column.key === "tipoVehiculo" ? (
                      <Skeleton className="h-6 w-20 rounded-full" />
                    ) : (
                      <Skeleton className="h-4 w-24" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" disabled className="opacity-50">
          Anterior
        </Button>
        <Button variant="outline" disabled className="opacity-50">
          Siguiente
        </Button>
      </div>
    </div>
  );
}
