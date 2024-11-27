"use server";

import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
}

export const getUserById = async (id?: string) => {
  if (!id) {
    return null;
  }

  try {
    const userFound = await db.user.findUnique({
      where: {
        id,
      },
    });

    return userFound;
  } catch {
    return null;
  }
};

export async function getUsers(currentUserId: string) {
  try {
    const users = await db.user.findMany({
      where: {
        role: {
          not: "SuperAdmin",
        },
        id: {
          not: currentUserId,
        },
      },
    });

    return users;
  } catch {
    return [];
  }
}
