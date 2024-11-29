import { getFeesData } from "@/actions/dashboard";
import { FeeSelector } from "./fee-selector";

export async function ParkingFees() {
  const feesData = await getFeesData();

  const existingFees = feesData.fees.length !== 0;

  return <>{existingFees && <FeeSelector feesData={feesData} />}</>;
}
