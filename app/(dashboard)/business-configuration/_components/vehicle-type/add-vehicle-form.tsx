import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { CreateVehicleTypeSchema } from "@/schemas/business-config";
import { VehicleTypeColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createVehicleType } from "@/actions/business-config";

interface AddVehicleFormProps {
  initialData?: VehicleTypeColumns;
  closeDialog: () => void;
}

export function AddVehicleForm({
  initialData,
  closeDialog,
}: AddVehicleFormProps) {
  const form = useForm<z.infer<typeof CreateVehicleTypeSchema>>({
    resolver: zodResolver(CreateVehicleTypeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof CreateVehicleTypeSchema>) {
    try {
      const { error, success } = await createVehicleType(values);

      if (error) {
        toast.error("Error", {
          description: error,
        });
        form.resetField("name");
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tipo de vehículo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Introduce el nuevo tipo de vehículo"
                  disabled={isSubmitting}
                  className={cn(
                    fieldState.invalid &&
                      "focus-visible:ring-[#ef4444] border-[#ef4444]"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="primary"
          disabled={isSubmitting || !isValid}
          className="w-full"
        >
          {isSubmitting && <Loader className="animate-spin" />}
          Guardar
        </Button>
      </form>
    </Form>
  );
}
