import { z } from "zod";

export const CreateVehicleTypeSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener mínimo dos caracteres.",
    })
    .trim(),
});

export const CreateClientTypeSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener mínimo dos caracteres.",
    })
    .trim(),
});

export const CreateFeeSchema = z.object({
  vehicleTypeId: z.string({
    required_error: "Por favor seleccione un tipo de vehículo.",
  }),
  clientTypeId: z.string({
    required_error: "Por favor seleccione un tipo de cliente.",
  }),
  hourlyFee: z
    .number({
      required_error: "La tarifa por hora es requerida.",
      invalid_type_error: "La tarifa por hora debe ser un número.",
    })
    .min(0, "La tarifa por hora no puede ser negativa."),
  monthlyFee: z
    .number({
      required_error: "La tarifa por mes es requerida.",
      invalid_type_error: "La tarifa por mes debe ser un número.",
    })
    .min(0, "La tarifa por mes no puede ser negativa."),
});
