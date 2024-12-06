"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HourlyClientColumns } from "./columns";
import { HourlyClientSchema } from "@/schemas/clients";
import {
  createHourlyClient,
  updateHourlyClient,
} from "@/actions/hourly-clients";
import { PlateInput } from "@/components/ui/plate-input";
import { SelectableCard } from "./selectable-card";

type FormValues = z.infer<typeof HourlyClientSchema>;

interface HourlyClientFormProps {
  initialData?: HourlyClientColumns;
  vehicleTypes: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  clientTypes: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  closeDialog: () => void;
}

export function HourlyClientForm({
  initialData,
  clientTypes,
  vehicleTypes,
  closeDialog,
}: HourlyClientFormProps) {
  const [isLoading, startTransition] = useTransition();
  const defaultClientTypeId = clientTypes.length === 1 ? clientTypes[0].id : "";
  const defaultVehicleTypeId =
    vehicleTypes.length === 1 ? vehicleTypes[0].id : "";

  const form = useForm<FormValues>({
    resolver: zodResolver(HourlyClientSchema),
    defaultValues: {
      plate: initialData?.plate || "",
      clientTypeId: initialData?.clientTypeId || defaultClientTypeId,
      vehicleTypeId: initialData?.vehicleTypeId || defaultVehicleTypeId,
    },
  });

  async function onSubmit(values: z.infer<typeof HourlyClientSchema>) {
    try {
      if (!initialData) {
        handleCreateClient(values);
      } else {
        handleUpdateClient(values);
      }
    } catch {
      toast.error("Ocurrió un problema con tu solicitud.");
    }
  }

  function handleCreateClient(values: z.infer<typeof HourlyClientSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await createHourlyClient(values);

        if (error) {
          toast.error("Error", {
            description: error,
          });
        }

        if (success) {
          form.reset();
          toast.success("Proceso exitoso.", {
            description: success,
          });
        }
      } catch {
        toast.error("Ocurrió un problema con tu solicitud.");
      }
    });
  }

  function handleUpdateClient(values: z.infer<typeof HourlyClientSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await updateHourlyClient(
          values,
          initialData?.id!
        );

        if (error) {
          toast.error("Error", {
            description: error,
          });
        }

        if (success) {
          form.reset();
          toast.success("Proceso exitoso.", {
            description: success,
          });
          closeDialog();
        }
      } catch {
        toast.error("Ocurrió un problema con tu solicitud.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <PlateInput
                  isSubmitting={isLoading}
                  {...field}
                  onChange={(e) => {
                    let inputValue = e.target.value;

                    // Eliminamos todo lo que no sea alfanumérico
                    inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, "");

                    // Aplicamos la máscara
                    if (inputValue.length <= 3) {
                      inputValue = inputValue.toUpperCase(); // Solo letras
                    } else if (inputValue.length <= 6) {
                      inputValue = inputValue
                        .toUpperCase()
                        .replace(/(.{3})(.{0,3})/, "$1 $2"); // Añadimos el espacio
                    } else {
                      inputValue = inputValue.toUpperCase().slice(0, 7); // Limitar longitud
                    }

                    form.setValue("plate", inputValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {clientTypes.length > 1 && (
          <FormField
            control={form.control}
            name="clientTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de cliente</FormLabel>
                {clientTypes.length <= 3 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {clientTypes.map((clientType) => (
                      <SelectableCard
                        key={clientType.id}
                        id={clientType.id}
                        name={clientType.name}
                        checked={field.value === clientType.id}
                        onChange={(id) =>
                          field.onChange(field.value === id ? "" : id)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Seleccione un tipo de cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientTypes.map((clientType) => (
                        <SelectItem key={clientType.id} value={clientType.id}>
                          {clientType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {vehicleTypes.length > 1 && (
          <FormField
            control={form.control}
            name="vehicleTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de vehículo</FormLabel>
                {vehicleTypes.length <= 4 ? (
                  <div className="flex flex-wrap gap-2">
                    {vehicleTypes.map((vehicleType) => (
                      <SelectableCard
                        key={vehicleType.id}
                        id={vehicleType.id}
                        name={vehicleType.name}
                        checked={field.value === vehicleType.id}
                        onChange={(id) =>
                          field.onChange(field.value === id ? "" : id)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Seleccione un tipo de vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleTypes.map((vehicleType) => (
                        <SelectItem key={vehicleType.id} value={vehicleType.id}>
                          {vehicleType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          variant="primary"
          disabled={
            isLoading ||
            !form.watch("vehicleTypeId") ||
            !form.watch("clientTypeId") ||
            form.watch("plate").length < 7
          }
          className="w-full"
        >
          {isLoading && <Loader className="animate-spin" />}
          {!initialData ? "Crear cliente" : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  );
}
