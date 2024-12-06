import React from "react";
import ReactDataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PreviewTableProps {
  data: any[];
  reportType: string;
}

export function PreviewReport({ data, reportType }: PreviewTableProps) {
  const columns =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          key,
          name: key,
        }))
      : [];

  return (
    <Card className="dark:bg-muted/20 bg-muted-foreground/5 overflow-hidden max-w-[1200px] mx-auto rounded-md">
      <CardHeader>
        <CardTitle>Vista Previa del Reporte</CardTitle>
        <CardDescription className="text-lg">
          {reportType}
        </CardDescription>
        <p className="text-[13px] text-muted-foreground pt-2">
          Total de {data.length} {data.length === 1 ? "registro" : "registros"}
        </p>
      </CardHeader>
      <ReactDataGrid
        className="w-full h-fit bg-transparent max-h-[500px]"
        rowHeight={45}
        columns={columns}
        rows={data}
      />
    </Card>
  );
}
