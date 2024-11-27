"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { MonthlyClientSchema } from "@/schemas/clients";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { createMonthlyClient } from "@/actions/monthly-clients";

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

export function MonthlyClientRegistrationForm({
  initialData,
  clientTypes,
  vehicleTypes,
  closeDialog,
}: MonthlyClientRegistrationFormProps) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(MonthlyClientSchema),
    defaultValues: {
      name: "",
      document: "",
      phone: "",
      plate: "",
      email: "",
      clientTypeId: "",
      vehicleTypeId: "",
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
        // const { error, success } = await updateFees(
        //   values,
        //   initialData?.hourlyFeeId!,
        //   initialData?.monthlyFeeId!
        // );
        // if (error) {
        //   toast.error("Error", {
        //     description: error,
        //   });
        // }
        // if (success) {
        //   form.reset();
        //   toast.success("Proceso exitoso.", {
        //     description: success,
        //   });
        //   closeDialog();
        // }
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
              <FormLabel>Matrícula del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Matrícula" {...field} />
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
                  {/* Añadir más tipos de cliente según sea necesario */}
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
                  {/* Añadir más tipos de vehículo según sea necesario */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="primary"
          disabled={isLoading || !isValid || form.watch("phone").length < 13}
          className="w-full"
        >
          {isLoading && <Loader className="animate-spin" />}
          Registrar Cliente
        </Button>
      </form>
    </Form>
  );
}
