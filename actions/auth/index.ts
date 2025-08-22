"use server";

import { z } from "zod";
import { LoginSchema, RegisterSchema } from "@/schemas/auth";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_AUTH_REDIRECT } from "@/routes";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "../user";
import { monthlyServiceConfirmationEmail } from "@/lib/brevo";

export async function login(credentials: z.infer<typeof LoginSchema>) {
  const result = LoginSchema.safeParse(credentials);

  if (result.error) {
    return { error: "Credenciales invalidas!" };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: process.env.DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas!" };
        default:
          return { error: error.cause?.err?.message };
      }
    }

    throw error;
  }
}

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Datos invalidos!" };
  }

  const {
    email,
    name,
    password,
    phone,
    parkingName,
    complaintsAndSuggestionsMail,
  } = validatedFields.data;

  try {
    const existingParking = await db.parkingLot.findFirst({
      where: { name: parkingName },
    });

    if (existingParking) {
      return { error: "Ya existe un negocio con este nombre." };
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "El email ingresado ya esta en uso!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdminUser = await db.user.create({
      data: {
        name,
        phone,
        email,
        role: "SuperAdmin",
        password: hashedPassword,
      },
    });

    const parkingLot = await db.parkingLot.create({
      data: {
        name: parkingName,
        pqrsEmail: complaintsAndSuggestionsMail,
        users: { connect: { id: superAdminUser.id } },
      },
    });

    // Update the user's parkingLotId after creating the parking lot
    await db.user.update({
      where: { id: superAdminUser.id },
      data: { parkingLotId: parkingLot.id },
    });

    monthlyServiceConfirmationEmail(
      superAdminUser.email!,
      superAdminUser.name!,
      password
    );

    await signIn("credentials", {
      email,
      password,
      redirectTo: process.env.DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Negocio creado!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas!" };
        default:
          return { error: error.cause?.err?.message };
      }
    }

    throw error;
  }
};

export async function logout() {
  await signOut({ redirectTo: DEFAULT_AUTH_REDIRECT });
}
