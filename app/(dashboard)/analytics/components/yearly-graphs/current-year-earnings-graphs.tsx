import {
  getClientsCountByCategoryYear,
  getYearlyEarnings,
} from "@/actions/analytics";
import { YearlyEarningsChart } from "./yearly-earnings-chart";
import { YearlyEarningsAreaChart } from "./yearly-earnings-area-chart";
import YearlyPieChart from "./yearly-pie-chart";

export async function CurrentYearEarningsGraphs() {
  const yearlyEarnings = await getYearlyEarnings();
  const yearlyClientsByCategory = await getClientsCountByCategoryYear();

  return (
    <div className="space-y-6 overflow-x-hidden">
      <YearlyEarningsChart chartData={yearlyEarnings} />
      <div className="flex md:flex-wrap max-md:flex-col items-center gap-4">
        <YearlyEarningsAreaChart chartData={yearlyEarnings} />
        {yearlyClientsByCategory.length > 0 && (
          <YearlyPieChart
            yearlyClientsCountByCategory={yearlyClientsByCategory}
          />
        )}
      </div>
    </div>
  );
}
