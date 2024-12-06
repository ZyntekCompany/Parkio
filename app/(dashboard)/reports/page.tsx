"use client";

import { toast } from "sonner";
import { DateTime } from "luxon";
import { FileDown, FileText } from "lucide-react";
import { useState, useTransition } from "react";
import * as XLSX from "xlsx";

import { Heading } from "@/components/common/heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PreviewReport } from "./components/preview-report";
import { ActionButton } from "./components/action-button";
import { DateInputFilter } from "./components/date-input-filter";
import { ReportTypeSelector } from "./components/report-type-selector";
import { ReportPreviewSkeleton } from "@/components/skeletons/report-preview-skeleton";

type GenerateReportRequest = {
  reportType: string;
  startDate: string;
  endDate: string;
  generateWithoutDateRange: boolean;
};

export default function ReportsPage() {
  const [isLoading, startTransition] = useTransition();
  const [isLoadingPreview, startPreviewTransition] = useTransition();

  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [withoutDateRange, setWithoutDateRange] = useState(false);

  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = () => {
    const validateInputs = (
      withoutDateRange: boolean,
      reportType?: string,
      startDate?: string,
      endDate?: string
    ): boolean => {
      // Saltar validación si el tipo de reporte es "Clientes Mensuales Próximos a Expirar"
      if (reportType === "Clientes Mensuales Próximos a Expirar") {
        return true;
      }

      if (withoutDateRange && !reportType) {
        toast.warning("Por favor, seleccione el tipo de reporte.");
        return false;
      }

      if (!withoutDateRange && (!reportType || !startDate || !endDate)) {
        toast.warning("Por favor, completa todos los campos.");
        return false;
      }

      return true;
    };

    const downloadReport = (blob: Blob, fileName: string): void => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setShowPreview(false);
      setPreviewData([]);
    };

    const getFileName = (
      reportType: string,
      withoutDateRange: boolean,
      start?: DateTime,
      end?: DateTime
    ): string => {
      if (
        withoutDateRange ||
        reportType === "Clientes Mensuales Próximos a Expirar"
      )
        return `${reportType}.xlsx`;
      return `${reportType}-${start?.toISODate()}-to-${end?.toISODate()}.xlsx`;
    };

    startTransition(async () => {
      if (!validateInputs(withoutDateRange, reportType, startDate, endDate))
        return;

      const start = DateTime.fromISO(startDate).setZone("America/Bogota");
      const end = DateTime.fromISO(endDate).setZone("America/Bogota");

      const requestBody: GenerateReportRequest = {
        reportType,
        startDate: start.toISO()!,
        endDate: end.toISO()!,
        generateWithoutDateRange: withoutDateRange,
      };

      try {
        const res = await fetch("/api/generate-report", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errData = await res.json();
          const message: string = errData.message || "Error desconocido";
          errData.message === "No hay clientes con servicio próximo a expirar."
            ? toast.warning(message)
            : toast.error(message);
          setShowPreview(false);
          setPreviewData([]);
          return;
        }

        const blob = await res.blob();
        downloadReport(
          blob,
          getFileName(reportType, withoutDateRange, start, end)
        );
      } catch (error) {
        toast.error("Hubo un problema generando el reporte.");
      }
    });
  };

  const handleGeneratePreview = () => {
    if (!reportType) {
      toast.warning("Selecciona un tipo de reporte para la vista previa.");
      return;
    }

    startPreviewTransition(async () => {
      try {
        const res = await fetch("/api/generate-report", {
          method: "POST",
          body: JSON.stringify({
            reportType,
            startDate: withoutDateRange ? null : startDate,
            endDate: withoutDateRange ? null : endDate,
            generateWithoutDateRange: withoutDateRange,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errData = await res.json();
          toast.warning(errData.message || "Error desconocido.");
          setShowPreview(false);
          setPreviewData([]);
          return;
        }

        const blob = await res.blob();
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          if (e.target?.result) {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const binary = new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            );
            const workbook = XLSX.read(binary, { type: "binary" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(firstSheet);
            setPreviewData(data);
            setShowPreview(true);
          }
        };

        fileReader.readAsArrayBuffer(blob);
      } catch (error) {
        toast.error("Error cargando la vista previa.");
      }
    });
  };

  return (
    <div className="space-y-6 xs:p-4">
      <Card className="dark:bg-muted/20 bg-muted-foreground/5 overflow-hidden space-y-4 max-w-[1200px] mx-auto">
        <CardHeader className="px-4 sm:p-6 sm:pb-3">
          <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3">
            <Heading
              title="Generación de reportes"
              description="Selecciona el tipo de reporte y el rango de fechas para generar tu informe."
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReportTypeSelector
            handleOnValueChange={(value) => {
              setReportType(value);
              setShowPreview(false);
              setPreviewData([]);
            }}
          />
          {reportType !== "Clientes Mensuales Próximos a Expirar" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <Label>Rango de Fechas</Label>
                <div className="flex ss:flex-row flex-col gap-4">
                  <DateInputFilter
                    label="Fecha de Inicio"
                    labelId="start-date"
                    disable={
                      withoutDateRange ||
                      reportType === "Clientes Mensuales Próximos a Expirar"
                    }
                    handleOnChange={(value) => setStartDate(value)}
                  />
                  <DateInputFilter
                    label="Fecha de Fin"
                    labelId="end-date"
                    disable={
                      withoutDateRange ||
                      reportType === "Clientes Mensuales Próximos a Expirar"
                    }
                    handleOnChange={(value) => setEndDate(value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pl-2">
                <Checkbox
                  disabled={
                    reportType === "Clientes Mensuales Próximos a Expirar"
                  }
                  id="withoutDateRange"
                  checked={withoutDateRange}
                  onCheckedChange={(checked) => {
                    setWithoutDateRange(!!checked);
                  }}
                />
                <label
                  htmlFor="withoutDateRange"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {reportType === "Ganancias"
                    ? "Generar reporte de ganancias anual"
                    : "Generar sin un rango de fechas específico"}
                </label>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex ss:flex-row flex-col ss:justify-between gap-3">
          <ActionButton
            label="Vista Previa"
            disable={
              isLoading ||
              isLoadingPreview ||
              !reportType ||
              (reportType !== "Clientes Mensuales Próximos a Expirar" &&
                !withoutDateRange &&
                (!startDate || !endDate))
            }
            variant="outline"
            handleOnClick={handleGeneratePreview}
            Icon={FileText}
            isLoading={isLoadingPreview}
          />
          <ActionButton
            label="Generar Reporte"
            disable={
              isLoading ||
              isLoadingPreview ||
              !reportType ||
              (reportType !== "Clientes Mensuales Próximos a Expirar" &&
                !withoutDateRange &&
                (!startDate || !endDate))
            }
            variant="primary"
            handleOnClick={handleGenerateReport}
            Icon={FileDown}
            isLoading={isLoading}
          />
        </CardFooter>
      </Card>
      {isLoadingPreview && <ReportPreviewSkeleton reportType={reportType} />}
      {showPreview && !isLoadingPreview && (
        <PreviewReport reportType={reportType} data={previewData} />
      )}
    </div>
  );
}
