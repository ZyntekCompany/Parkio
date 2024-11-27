import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo válido." })
    .trim(),
  password: z.string().min(1).trim(),
});

export const UpdateSchema = z.object({
  email: z
    .string({ required_error: "El correo es requerido." })
    .min(1, "El correo es requerido.")
    .email("Correo no válido."),
  password: z.string().trim().optional(),
  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(1, {
      message: "Debe tener al menos un carácter.",
    })
    .trim(),
  role: z.string({
    required_error: "Por favor seleccione un rol.",
  }),
  phone: z
    .string({ required_error: "Número de teléfono requerido." })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "El número de teléfono debe ser válido y contener entre 7 y 15 dígitos.",
    })
    .trim(),
});

export const RegisterSchema = z.object({
  email: z
    .string({ required_error: "El correo es requerido." })
    .min(1, "El correo es requerido.")
    .email("Correo no válido."),
  password: z
    .string()
    .min(8, { message: "Debe tener al menos 8 caracteres" })
    .regex(/[a-zA-Z]/, { message: "Debe contener por lo menos 1 letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos 1 numero." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos 1 carácter especial.",
    })
    .trim(),
  name: z
    .string({ required_error: "El nombre es requerido." })
    .min(1, {
      message: "Debe tener al menos un carácter.",
    })
    .trim(),
  phone: z
    .string({ required_error: "Número de teléfono requerido." })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "El número de teléfono debe ser válido y contener entre 7 y 15 dígitos.",
    })
    .trim(),
});
