import { Heading } from "@/components/common/heading";
import { EarningsGraphs } from "./components/earnings-graphs";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 xs:p-4">
      <div className="flex md-plus:flex-row flex-col justify-between md-plus:items-center gap-3">
        <Heading
          title="Panel de Analíticas"
          description="Comprende a fondo las estadísticas clave de tu negocio para tomar decisiones informadas."
        />
      </div>
      <EarningsGraphs />
    </div>
  );
}
