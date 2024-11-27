"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useTransition } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateFeeSchema } from "@/schemas/business-config";
import { FeeColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFees, updateFees } from "@/actions/business-config";

interface AddFeeFormProps {
  initialData?: FeeColumns;
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

export function AddFeeForm({
  initialData,
  clientTypes,
  vehicleTypes,
  closeDialog,
}: AddFeeFormProps) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateFeeSchema>>({
    resolver: zodResolver(CreateFeeSchema),
    defaultValues: {
      vehicleTypeId: initialData?.vehicleTypeId ?? "",
      clientTypeId: initialData?.clientTypeId ?? "",
      hourlyFee: initialData?.hourlyFee ?? 0,
      monthlyFee: initialData?.monthlyFee ?? 0,
    },
  });

  const { isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof CreateFeeSchema>) {
    try {
      if (!initialData) {
        handleCreateFees(values);
      } else {
        handleUpdateFees(values);
      }
    } catch {
      toast.error("Ocurrió un problema con tu solicitud.");
    }
  }

  function handleCreateFees(values: z.infer<typeof CreateFeeSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await createFees(values);

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

  function handleUpdateFees(values: z.infer<typeof CreateFeeSchema>) {
    startTransition(async () => {
      try {
        const { error, success } = await updateFees(
          values,
          initialData?.hourlyFeeId!,
          initialData?.monthlyFeeId!
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vehicleTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Vehículo</FormLabel>
              <Select
                disabled={!initialData ? false : true}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo de vehículo" />
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

        <FormField
          control={form.control}
          name="clientTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Cliente</FormLabel>
              <Select
                disabled={!initialData ? false : true}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo de cliente" />
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

        <div className="flex items-center gap-3">
          <FormField
            control={form.control}
            name="hourlyFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarifa por Hora</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 rounded-md"
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarifa por Mes</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 rounded-md"
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          variant="primary"
          disabled={
            isLoading ||
            !isValid ||
            form.watch("hourlyFee") <= 0 ||
            form.watch("monthlyFee") <= 0
          }
          className="w-full"
        >
          {isLoading && <Loader className="animate-spin" />}
          Guardar
        </Button>
      </form>
    </Form>
  );
}
