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

import { CreateClientTypeSchema } from "@/schemas/business-config";
import { ClientTypeColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClientType } from "@/actions/business-config";

interface AddVehicleFormProps {
  initialData?: ClientTypeColumns;
  closeDialog: () => void;
}

export function AddClientForm({
  initialData,
  closeDialog,
}: AddVehicleFormProps) {
  const form = useForm<z.infer<typeof CreateClientTypeSchema>>({
    resolver: zodResolver(CreateClientTypeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof CreateClientTypeSchema>) {
    try {
      const { error, success } = await createClientType(values);

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
