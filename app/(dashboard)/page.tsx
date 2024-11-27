import {
  getDailyChartData,
  getDailyEarnings,
  getFeesData,
} from "@/actions/dashboard";
import { DailyEarnings } from "@/components/dashboard/daily-earnings";
import ParkingFees from "@/components/dashboard/parking-fees";

export default async function Dashboard() {
  const dailyEarnings = await getDailyEarnings();
  const dailyChartData = await getDailyChartData();
  const feesData = await getFeesData();

  const existingFees = feesData.fees.length !== 0;

  return (
    <div className="space-y-6 xs:p-4">
      {/* Para el administrador mostrar un componente que le indique cual es el empleado en el turno actual */}
      <DailyEarnings earningData={dailyEarnings} chartData={dailyChartData} />
      {existingFees && <ParkingFees feesData={feesData} />}
    </div>
  );
}
