import { Client, ClientType, VehicleType } from "@prisma/client";

export interface ExtendedClient extends Client {
  clientType: ClientType; // Relación con el tipo de cliente
  vehicleType: VehicleType; // Relación con el tipo de vehículo
}