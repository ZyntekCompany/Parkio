import { getDailyChartData, getDailyEarnings } from "@/actions/dashboard";
import { DailyEarningsChart } from "./daily-earnings-chart";

export async function DailyEarnings() {
  const dailyEarnings = await getDailyEarnings();
  const dailyChartData = await getDailyChartData();

  return (
    <DailyEarningsChart
      chartData={dailyChartData}
      earningData={dailyEarnings}
    />
  );
}
