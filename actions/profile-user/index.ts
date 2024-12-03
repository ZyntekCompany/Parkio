"use server";

import { z } from "zod";
import { ChangePasswordSchema, UserDataSchema } from "@/schemas/user-account";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { getUserById } from "../user";
import { currentUser } from "@/lib/auth-user";
import { deleteImage } from "../uploadthing";

export async function updateUserProfile(
  userData: z.infer<typeof UserDataSchema>
) {
  const loggedUser = await currentUser();
  const result = UserDataSchema.safeParse(userData);

  if (result.error) {
    return { error: "Datos inváidos!" };
  }

  const { name, phone } = result.data;

  try {
    const existingUser = await getUserById(loggedUser?.id!);

    if (!existingUser) {
      return { error: "El usuario no existe!" };
    }

    await db.user.update({
      where: { id: loggedUser?.id },
      data: {
        name,
        phone,
      },
    });

    revalidatePath("/dashboard");
    return { success: "Datos actualizados correctamente." };
  } catch (error) {
    return { error: "Algo salio mal en el proceso." };
  }
}

export async function changePassword(
  passwordCredentials: z.infer<typeof ChangePasswordSchema>
) {
  const loggedUser = await currentUser();
  const result = ChangePasswordSchema.safeParse(passwordCredentials);

  if (result.error) {
    return { error: "Datos inváidos!" };
  }

  const { oldPassword, newPassword } = result.data;

  try {
    const existingUser = await getUserById(loggedUser?.id!);

    if (!existingUser) {
      return { error: "El usuario no existe!" };
    }

    const passwordMatch = await bcrypt.compare(
      oldPassword,
      existingUser?.password!
    );

    if (!passwordMatch) {
      return { error: "Contraseña anterior incorrecta." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });
  } catch (error) {
    return { error: "Algo salio mal en el proceso." };
  }
}

export async function updateUserImage(newImage: string) {
  try {
    const loggedUser = await currentUser();

    if (loggedUser?.image) {
      await deleteImage(loggedUser.image);
    }

    await db.user.update({
      where: { id: loggedUser?.id },
      data: { image: newImage },
    });

    revalidatePath("/dashboard");
    return { success: "Imagen cambiada exitosamente." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export async function deleteProfileImage() {
  try {
    const loggedUser = await currentUser();

    await db.user.update({
      where: { id: loggedUser?.id },
      data: { image: null },
    });

    revalidatePath("/dashboard");
    return { success: "Imagen eliminada exitosamente." };
  } catch (error) {
    return { error: "Algo salio mal en el proceso" };
  }
}
