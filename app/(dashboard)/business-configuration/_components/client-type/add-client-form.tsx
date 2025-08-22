import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";

import { CreateClientTypeSchema, UpdateClientTypeSchema } from "@/schemas/business-config";
import { ClientTypeColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClientType, updateClientType } from "@/actions/business-config";

interface AddClientFormProps {
  initialData?: ClientTypeColumns;
  onSuccess?: () => void;
}

export function AddClientForm({ initialData, onSuccess }: AddClientFormProps) {
  const isEditing = !!initialData;
  const schema = isEditing ? UpdateClientTypeSchema : CreateClientTypeSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      hasHourlyLimit: initialData?.hasHourlyLimit ?? false,
      hourlyLimit: initialData?.hourlyLimit ?? null,
      ...(isEditing && { id: initialData.id }),
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const hasHourlyLimit = form.watch("hasHourlyLimit");

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      let result;
      
      if (isEditing) {
        result = await updateClientType(values as z.infer<typeof UpdateClientTypeSchema>);
      } else {
        result = await createClientType(values as z.infer<typeof CreateClientTypeSchema>);
      }

      if (result.error) {
        toast.error("Error", {
          description: result.error,
        });
        return;
      }

      if (result.success) {
        form.reset();
        toast.success("Proceso exitoso.", {
          description: result.success,
        });
        onSuccess?.();
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
              <FormLabel>Tipo de cliente</FormLabel>
              <FormControl>
                <Input
                  placeholder="Introduce el nuevo tipo de cliente"
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

        <FormField
          name="hasHourlyLimit"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    // Limpiar el campo hourlyLimit cuando se desactiva
                    if (!checked) {
                      form.setValue("hourlyLimit", null);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>¿Tiene límite de horas?</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {hasHourlyLimit && (
          <FormField
            name="hourlyLimit"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Límite de horas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Ej: 24"
                    disabled={isSubmitting}
                    className={cn(
                      fieldState.invalid &&
                        "focus-visible:ring-[#ef4444] border-[#ef4444]"
                    )}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === "" ? null : Number(value);
                      field.onChange(numValue);
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          variant="primary"
          disabled={isSubmitting || !isValid}
          className="w-full"
        >
          {isSubmitting && <Loader className="animate-spin" />}
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
