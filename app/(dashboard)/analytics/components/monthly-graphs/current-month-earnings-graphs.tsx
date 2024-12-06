import { MonthlyEarningsChart } from "./monthly-earnings-chart";
import {
  getClientsCountByCategoryMonth,
  getMonthlyEarnings,
} from "@/actions/analytics";
import { MonthlyEarningsAreaChart } from "./monthly-earnings-area-chart";
import MonthlyPieChart from "./monthly-pie-chart";

export async function CurrentMonthEarningsGraphs() {
  const monthlyEarnings = await getMonthlyEarnings();
  const monthlyClientsByCategory = await getClientsCountByCategoryMonth();

  return (
    <div className="space-y-6 overflow-x-hidden">
      <MonthlyEarningsChart chartData={monthlyEarnings} />
      <div className="flex md:flex-wrap max-md:flex-col items-center gap-4">
        <MonthlyEarningsAreaChart chartData={monthlyEarnings} />
        {monthlyClientsByCategory.length > 0 && (
          <MonthlyPieChart
            monthlyClientsCountByCategory={monthlyClientsByCategory}
          />
        )}
      </div>
    </div>
  );
}
