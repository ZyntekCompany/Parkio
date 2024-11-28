"use server";

import { db } from "@/lib/db";
import { CreateEmployeeSchema, UpdateSchema } from "@/schemas/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { UserColumns } from "@/app/(dashboard)/employee-management/_components/columns";
import { getUserByEmail } from "../user";
import { currentRole, currentUser } from "@/lib/auth-user";
import { sendEmployeeCredentialsEmail } from "@/lib/brevo";

export async function createEmployee(
  credentials: z.infer<typeof CreateEmployeeSchema>
) {
  const result = CreateEmployeeSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Datos invalidos!" };
  }

  const { name, phone, email, password } = result.data;

  try {
    const loggedUser = await currentUser();
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "El correo ingresado ya esta en uso!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "Empleado",
        parkingLotId: loggedUser?.parkingLotId!,
      },
      include: {
        parkingLot: {
          select: {
            name: true,
          },
        },
      },
    });

    sendEmployeeCredentialsEmail(
      newEmployee.email!,
      newEmployee.name!,
      password,
      newEmployee.parkingLot?.name!
    );

    revalidatePath("/employee-management");
    return { success: "Usuario creado." };
  } catch {
    return { error: "Algo salio mal en el proceso." };
  }
}

export async function updateUser(
  credentials: z.infer<typeof UpdateSchema>,
  userId: string
) {
  const result = UpdateSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Datos invalidos!" };
  }

  const { name, phone, email, password, role } = result.data;

  try {
    const loggedRole = await currentRole();

    const isAdmin = loggedRole === "Admin" || loggedRole === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "El usuario no existe!" };
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: role as UserRole,
        },
      });
    } else {
      await db.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          phone,
          role: role as UserRole,
        },
      });
    }

    revalidatePath("/employee-management");
    return { success: "Usuario actualizado." };
  } catch {
    return { error: "Algo salio mal en el proceso." };
  }
}

export async function deleteUser(userData: UserColumns) {
  try {
    const role = await currentRole();

    const isAdmin = role === "Admin" || role === "SuperAdmin";

    if (!isAdmin) {
      return { error: "No tiene accesso a este proceso." };
    }

    await db.user.delete({
      where: { id: userData.id },
    });

    revalidatePath("/employee-management");
    return { success: "Usuario eliminado." };
  } catch {
    return { error: "Algo salió mal en el proceso." };
  }
}
