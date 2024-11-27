"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { FeeColumns } from "@/app/(dashboard)/business-configuration/_components/fee/columns";
import { currentRole } from "@/lib/auth-user";
import {
  CreateClientTypeSchema,
  CreateFeeSchema,
  CreateVehicleTypeSchema,
} from "@/schemas/business-config";

export async function getVehicleTypes() {
  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return [];
    }

    return await db.vehicleType.findMany();
  } catch {
    return [];
  }
}

export async function getClientTypes() {
  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return [];
    }

    return await db.clientType.findMany();
  } catch {
    return [];
  }
}

export async function getFees() {
  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return [];
    }

    const fees = await db.vehicleType.findMany({
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
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { name } = result.data;

    const existingVehicleType = await db.vehicleType.findUnique({
      where: { name },
    });

    if (existingVehicleType) {
      return { error: `El tipo de vehículo '${name}' ya existe.` };
    }

    await db.vehicleType.create({
      data: { name },
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
  const result = CreateClientTypeSchema.safeParse(values);

  if (result.error) {
    return { error: "Datos inválidos." };
  }

  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { name } = result.data;

    const existingClientType = await db.clientType.findUnique({
      where: { name },
    });

    if (existingClientType) {
      return { error: `El tipo de cliente '${name}' ya existe.` };
    }

    await db.clientType.create({
      data: { name },
    });

    revalidatePath("/business-configuration");
    return { success: "Tipo de cliente creado." };
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
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { vehicleTypeId, clientTypeId, hourlyFee, monthlyFee } = result.data;

    const existingFee = await db.fee.findFirst({
      where: { vehicleTypeId, clientTypeId },
    });

    if (existingFee) {
      return {
        error:
          "Las tarifas para el tipo de vehículo y cliente especificado ya existen.",
      };
    }

    await db.fee.create({
      data: {
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

    revalidatePath("/business-configuration");
    return { success: "Tarifas creadas." };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function deleteFees(data: FeeColumns) {
  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { clientTypeId, vehicleTypeId } = data;

    const existingClientType = await db.clientType.findUnique({
      where: { id: clientTypeId },
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

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const { vehicleTypeId, clientTypeId, hourlyFee, monthlyFee } = result.data;

    const existingFee = await db.fee.findFirst({
      where: { vehicleTypeId, clientTypeId },
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
