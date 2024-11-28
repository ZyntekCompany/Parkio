"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { cn } from "@/lib/utils";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { createEmployee } from "@/actions/employee-management";
import { CreateEmployeeSchema } from "@/schemas/auth";

interface RegisterFormProps {
  buttonLabel?: string;
  closeDialog: () => void;
}

export function RegisterForm({ buttonLabel, closeDialog }: RegisterFormProps) {
  const form = useForm<z.infer<typeof CreateEmployeeSchema>>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof CreateEmployeeSchema>) => {
    try {
      const { error, success } = await createEmployee(values);

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
    } catch (error) {
      toast.error("Algo salió mal!");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 mt-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre del empleado"
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
            name="phone"
            control={form.control}
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Correo del empleado"
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    field={field}
                    isSubmitting={isSubmitting}
                    className={cn(
                      fieldState.invalid &&
                        "focus-visible:ring-[#ef4444] border-[#ef4444]"
                    )}
                  />
                </FormControl>
                <FormDescription className="text-[13.5px]">
                  La contraseña debe tener un mínimo de 8 caracteres, incluyendo
                  al menos 1 letra, 1 número y 1 carácter especial.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-3 pb-2">
            <Button
              variant="primary"
              type="submit"
              disabled={
                isSubmitting || !isValid || form.watch("phone").length < 13
              }
              className="w-full font-semibold"
            >
              {isSubmitting && (
                <Loader className="h-5 w-5 animate-spin" />
              )}
              {buttonLabel ? buttonLabel : "Registrarse"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
