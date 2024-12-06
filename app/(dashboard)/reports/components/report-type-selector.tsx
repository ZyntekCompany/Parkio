import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reportTypes } from "@/constants";

interface ReportTypeSelectorProps {
  handleOnValueChange: (value: string) => void;
}

export function ReportTypeSelector({
  handleOnValueChange,
}: ReportTypeSelectorProps) {
  return (
    <div>
      <Label htmlFor="report-type" className="mb-1">
        Tipo de Reporte
      </Label>
      <Select onValueChange={handleOnValueChange}>
        <SelectTrigger id="report-type" className="mt-2 h-12">
          <SelectValue placeholder="Selecciona un tipo de reporte" />
        </SelectTrigger>
        <SelectContent>
          {reportTypes.map((reportType) => (
            <SelectItem key={reportType} value={reportType}>
              {reportType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
