"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { FeeColumns } from "@/app/(dashboard)/business-configuration/_components/fee/columns";
import { currentRole, currentUser } from "@/lib/auth-user";
import {
  CreateClientTypeSchema,
  CreateFeeSchema,
  CreateVehicleTypeSchema,
  UpdateClientTypeSchema,
} from "@/schemas/business-config";

export async function getCurrentParkingLot() {
  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return null;
    }

    const existingParking = await db.parkingLot.findFirst({
      where: { id: loggedUser.parkingLotId! },
    });

    if (!existingParking) return null;

    return existingParking;
  } catch {
    return null;
  }
}

export async function getVehicleTypes() {
  try {
    const loggedUser = await currentUser();

    return await db.vehicleType.findMany({
      where: { parkingLotId: loggedUser?.parkingLotId! },
    });
  } catch {
    return [];
  }
}

export async function getClientTypes() {
  try {
    const loggedUser = await currentUser();

    return await db.clientType.findMany({
      where: { parkingLotId: loggedUser?.parkingLotId! },
    });
  } catch {
    return [];
  }
}

export async function getFees() {
  try {
    const role = await currentRole();
    const loggedUser = await currentUser();

    const fees = await db.vehicleType.findMany({
      where: {
        parkingLotId: loggedUser?.parkingLotId!,
      },
      include: {
        fees: {
          include: {
            clientType: true,
          },
        },
      },
    });

    const result = fees.flatMap((vehicleType) => {
      const hourlyFees = vehicleType.fees.filter(
        (fee) => fee.feeType === "HOURLY"
      );
      const monthlyFees = vehicleType.fees.filter(
        (fee) => fee.feeType === "MONTHLY"
      );

      return hourlyFees.map((hourlyFee) => {
        const monthlyFee = monthlyFees.find(
          (fee) => fee.clientTypeId === hourlyFee.clientTypeId
        );

        return {
          vehicleTypeId: vehicleType.id,
          clientTypeId: hourlyFee.clientType.id,
          vehicleType: vehicleType.name,
          clientType: hourlyFee.clientType.name,
          hourlyFee: hourlyFee.price,
          monthlyFee: monthlyFee ? monthlyFee.price : 0,
          hourlyFeeId: hourlyFee.id,
          monthlyFeeId: monthlyFee ? monthlyFee.id : "",
        };
      });
    });

    return result;
  } catch {
    return [];
  }
}

export async function createVehicleType(
  values: z.infer<typeof CreateVehicleTypeSchema>
) {
  const result = CreateVehicleTypeSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { name } = result.data;

    if (!loggedUser?.parkingLotId) {
      return { error: "No tienes un parqueadero asignado. Contacta al administrador del sistema para resolver este problema." };
    }

    const existingVehicleType = await db.vehicleType.findFirst({
      where: { name, parkingLotId: loggedUser.parkingLotId },
    });

    if (existingVehicleType) {
      return { error: `El tipo de vehículo '${name}' ya existe.` };
    }

    await db.vehicleType.create({
      data: {
        name,
        parkingLot: {
          connect: {
            id: loggedUser?.parkingLotId!,
          },
        },
      },
    });

    revalidatePath("/business-configuration");
    return { success: "Tipo de vehiculo creado." };
  } catch {
    
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function deleteVehicleType(id: string) {
  if (!id) {
    return { error: "ID del tipo de vehículo requerido." };
  }

  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const existingVehicleType = await db.vehicleType.findUnique({
      where: { id },
      include: {
        clients: true,
      },
    });

    if (existingVehicleType?.clients.length) {
      return {
        error: `No se puede completar el proceso. El tipo de vehiculo '${existingVehicleType.name}' está enlazado con usuarios existentes.`,
      };
    }

    const deletedVehicleType = await db.vehicleType.delete({
      where: { id },
    });

    revalidatePath("/business-configuration");
    return {
      success: `Tipo de vehiculo '${deletedVehicleType.name}' eliminado.`,
    };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function createClientType(
  values: z.infer<typeof CreateClientTypeSchema>
) {
  console.log("createClientType called with values:", values);
  
  const result = CreateClientTypeSchema.safeParse(values);
  console.log("Schema validation result:", result);

  if (result.error) {
    console.log("Schema validation failed:", result.error);
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();
    console.log("Logged user:", loggedUser);
    
    const role = await currentRole();
    console.log("User role:", role);

    const isAdmin = role === "Admin" || role === "SuperAdmin";
    console.log("Is admin:", isAdmin);

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { name, hasHourlyLimit, hourlyLimit } = result.data;
    console.log("Extracted data:", { name, hasHourlyLimit, hourlyLimit });

    if (!name || name.trim().length < 2) {
      return { error: "El nombre debe tener mínimo dos caracteres." };
    }

    if (!loggedUser?.parkingLotId) {
      return { error: "No tienes un parqueadero asignado. Contacta al administrador del sistema para resolver este problema." };
    }

    const existingClientType = await db.clientType.findFirst({
      where: { name, parkingLotId: loggedUser.parkingLotId },
    });
    console.log("Existing client type check:", existingClientType);

    if (existingClientType) {
      return { error: `El tipo de cliente '${name}' ya existe.` };
    }

    console.log("About to create client type with data:", {
      name,
      hasHourlyLimit,
      hourlyLimit: hasHourlyLimit ? hourlyLimit : null,
      parkingLotId: loggedUser?.parkingLotId
    });

    await db.clientType.create({
      data: {
        name,
        hasHourlyLimit,
        hourlyLimit: hasHourlyLimit ? hourlyLimit : null,
        parkingLot: {
          connect: {
            id: loggedUser?.parkingLotId!,
          },
        },
      },
    });

    console.log("Client type created successfully");
    revalidatePath("/business-configuration");
    return { success: "Tipo de cliente creado." };
  } catch (error) {
    console.error("Error in createClientType:", error);
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function updateClientType(
  values: z.infer<typeof UpdateClientTypeSchema>
) {
  const result = UpdateClientTypeSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { id, name, hasHourlyLimit, hourlyLimit } = result.data;

    if (!id) {
      return { error: "ID del tipo de cliente requerido." };
    }

    if (!name || name.trim().length < 2) {
      return { error: "El nombre debe tener mínimo dos caracteres." };
    }

    // Verificar si ya existe otro tipo de cliente con el mismo nombre
    const existingClientType = await db.clientType.findFirst({
      where: {
        name,
        parkingLotId: loggedUser?.parkingLotId!,
        id: { not: id }, // Excluir el registro actual
      },
    });

    if (existingClientType) {
      return { error: `El tipo de cliente '${name}' ya existe.` };
    }

    await db.clientType.update({
      where: { id },
      data: {
        name,
        hasHourlyLimit,
        hourlyLimit: hasHourlyLimit ? hourlyLimit : null,
      },
    });

    revalidatePath("/business-configuration");
    return { success: "Tipo de cliente actualizado." };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function deleteClientType(id: string) {
  if (!id) {
    return { error: "ID del tipo de cliente requerido." };
  }

  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const existingClientType = await db.clientType.findUnique({
      where: { id },
      include: {
        clients: true,
      },
    });

    if (existingClientType?.clients.length) {
      return {
        error: `No se puede completar el proceso. El tipo de cliente '${existingClientType.name}' está enlazado con usuarios existentes.`,
      };
    }

    const deletedClientType = await db.clientType.delete({
      where: { id },
    });

    revalidatePath("/business-configuration");
    return {
      success: `Tipo de cliente '${deletedClientType.name}' eliminado.`,
    };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function createFees(values: z.infer<typeof CreateFeeSchema>) {
  const result = CreateFeeSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const loggedUser = await currentUser();
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    if (!loggedUser?.parkingLotId) {
      return { error: "No tienes un parqueadero asignado. Contacta al administrador del sistema para resolver este problema." };
    }

    const { vehicleTypeId, clientTypeId, hourlyFee, monthlyFee } = result.data;

    const existingFee = await db.fee.findFirst({
      where: {
        vehicleTypeId,
        clientTypeId,
        parkingLotId: loggedUser.parkingLotId,
      },
    });

    if (existingFee) {
      return {
        error:
          "Las tarifas para el tipo de vehículo y cliente especificado ya existen.",
      };
    }

    await db.fee.create({
      data: {
        parkingLot: {
          connect: {
            id: loggedUser?.parkingLotId!,
          },
        },
        vehicleType: {
          connect: {
            id: vehicleTypeId,
          },
        },
        clientType: {
          connect: {
            id: clientTypeId,
          },
        },
        feeType: "HOURLY",
        price: hourlyFee,
      },
    });

    await db.fee.create({
      data: {
        parkingLot: {
          connect: {
            id: loggedUser?.parkingLotId!,
          },
        },
        vehicleType: {
          connect: {
            id: vehicleTypeId,
          },
        },
        clientType: {
          connect: {
            id: clientTypeId,
          },
        },
        feeType: "MONTHLY",
        price: monthlyFee,
      },
    });

    revalidatePath("/");
    revalidatePath("/business-configuration");
    return { success: "Tarifas creadas." };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function deleteFees(data: FeeColumns) {
  try {
    const role = await currentRole();
    const loggedUser = await currentUser();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { clientTypeId, vehicleTypeId } = data;

    const existingClientType = await db.clientType.findUnique({
      where: { id: clientTypeId, parkingLotId: loggedUser?.parkingLotId! },
      include: {
        clients: true,
      },
    });

    if (existingClientType?.clients.length) {
      return {
        error: `No se puede completar el proceso. Las tarifas estan enlazado con usuarios existentes.`,
      };
    }

    await db.fee.deleteMany({
      where: { vehicleTypeId, clientTypeId },
    });

    revalidatePath("/business-configuration");
    return { success: "Tarifas eliminadas" };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function updateFees(
  values: z.infer<typeof CreateFeeSchema>,
  hourlyFeeId: string,
  monthlyFeeId: string
) {
  const result = CreateFeeSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const role = await currentRole();
    const loggedUser = await currentUser();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { vehicleTypeId, clientTypeId, hourlyFee, monthlyFee } = result.data;

    const existingFee = await db.fee.findFirst({
      where: {
        vehicleTypeId,
        clientTypeId,
        parkingLotId: loggedUser?.parkingLotId!,
      },
    });

    if (!existingFee) {
      return {
        error:
          "Las tarifas para el tipo de vehículo y cliente especificado no existen.",
      };
    }

    await db.fee.update({
      where: {
        id: hourlyFeeId,
        vehicleTypeId,
        clientTypeId,
        feeType: "HOURLY",
      },
      data: {
        price: hourlyFee,
      },
    });

    await db.fee.update({
      where: {
        id: monthlyFeeId,
        vehicleTypeId,
        clientTypeId,
        feeType: "MONTHLY",
      },
      data: {
        price: monthlyFee,
      },
    });

    revalidatePath("/business-configuration");
    return { success: "Tarifas creadas." };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}
