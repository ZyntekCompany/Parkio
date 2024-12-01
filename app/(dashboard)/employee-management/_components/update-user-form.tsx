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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateSchema } from "@/schemas/auth";
import { cn } from "@/lib/utils";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { UserColumns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { updateUser } from "@/actions/employee-management";
import { PasswordInput } from "@/components/ui/password-input";

interface UpdateUserFormProps {
  initialData: UserColumns;
  closeDialog: () => void;
}

export function UpdateUserForm({
  initialData,
  closeDialog,
}: UpdateUserFormProps) {
  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      name: initialData.name,
      phone: initialData.phone,
      email: initialData.email,
      role: initialData.role,
      password: undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof UpdateSchema>) => {
    try {
      const { error, success } = await updateUser(values, initialData.id);

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
                    placeholder="Ingresa tu nombre"
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
                    placeholder="Ingresa tu correo"
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
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.Admin}>Admin</SelectItem>
                    <SelectItem value={UserRole.Empleado}>Empleado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="Contraseña"
                    isSubmitting={isSubmitting}
                    {...field}
                  />
                </FormControl>
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
              {isSubmitting && <Loader className="h-5 w-5 animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
