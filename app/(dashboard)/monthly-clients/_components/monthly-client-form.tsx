"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthlyClientColumns } from "./columns";
import { MonthlyClientSchema } from "@/schemas/clients";
import {
  createMonthlyClient,
  updateMonthlyClient,
} from "@/actions/monthly-clients";
import { PlateInput } from "@/components/ui/plate-input";

type FormValues = z.infer<typeof MonthlyClientSchema>;

interface MonthlyClientRegistrationFormProps {
  initialData?: MonthlyClientColumns;
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

export function MonthlyClientForm({
  initialData,
  clientTypes,
  vehicleTypes,
  closeDialog,
}: MonthlyClientRegistrationFormProps) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(MonthlyClientSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      document: initialData?.document ?? "",
      phone: initialData?.phone ?? "",
      plate: initialData?.plate ?? "",
      email: initialData?.email ?? "",
      clientTypeId: initialData?.clientTypeId ?? "",
      vehicleTypeId: initialData?.vehicleTypeId ?? "",
    },
  });

  const { isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof MonthlyClientSchema>) {
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

  function handleCreateClient(values: z.infer<typeof MonthlyClientSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await createMonthlyClient(values);

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

  function handleUpdateClient(values: z.infer<typeof MonthlyClientSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await updateMonthlyClient(
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input placeholder="Número de documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="co"
                  hideDropdown
                  value={field.value}
                  onChange={(phone) => {
                    field.onChange(phone);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de vehículo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="primary"
          disabled={
            isLoading ||
            !isValid ||
            form.watch("phone").length < 13 ||
            !form.watch("clientTypeId") ||
            !form.watch("vehicleTypeId") ||
            form.watch("plate").length < 7
          }
          className="w-full"
        >
          {isLoading && <Loader className="animate-spin" />}
          Registrar Cliente
        </Button>
      </form>
    </Form>
  );
}
