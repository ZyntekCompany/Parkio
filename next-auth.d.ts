import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"

// TODO: Extenderlo con el Id del parqueadero al que pertence
export type ExtendedUser = DefaultSession["user"] & {
  name: string | null
  image: string | null
  role: UserRole | null
  phone: string | null
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
