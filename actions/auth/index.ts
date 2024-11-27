"use server";

import { z } from "zod";
import { LoginSchema } from "@/schemas/auth";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_AUTH_REDIRECT } from "@/routes";

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

export async function logout() {
  await signOut({ redirectTo: DEFAULT_AUTH_REDIRECT });
}
