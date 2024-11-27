import { z } from "zod";

export const MonthlyClientSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  document: z.string().min(5, {
    message: "El documento debe tener al menos 5 caracteres.",
  }),
  phone: z
    .string({ required_error: "Número de teléfono requerido." })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "El número de teléfono debe ser válido y contener entre 7 y 15 dígitos.",
    })
    .trim(),
  plate: z.string().min(6, {
    message: "La matrícula debe tener al menos 6 caracteres.",
  }),
  email: z.string().email({
    message: "Debe ser un email válido.",
  }),
  clientTypeId: z.string({
    required_error: "Por favor seleccione un tipo de cliente.",
  }),
  vehicleTypeId: z.string({
    required_error: "Por favor seleccione un tipo de vehículo.",
  }),
});
