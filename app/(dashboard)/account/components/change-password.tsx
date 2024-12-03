"use client";

import { z } from "zod";
import { ChangePasswordSchema } from "@/schemas/user-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PasswordInput as SimplePasswordInput } from "@/components/auth/password-input";
import { logout } from "@/actions/auth";
import { changePassword } from "@/actions/profile-user";
import { PasswordInput } from "@/components/ui/password-input";

export function ChangePassword() {
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    try {
      const response = await changePassword(values);

      if (!response?.error) {
        form.reset();
        await logout();
      }

      if (response?.error) {
        toast.error(response?.error);
      }
    } catch (error) {
      toast.error("Algo salió mal!");
    }
  };

  return (
    <Card className="max-xs:p-0 dark:bg-muted/20 bg-muted-foreground/5 space-y-0 py-2">
      <CardHeader className="py-2 px-4 pt-4 pb-2 md:px-6 md:py-3">
        <CardTitle>Cambio de Contraseña</CardTitle>
        <CardDescription>
          Cambia tu contraseña aquí. Después de guardar, se cerrará la sesión.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 md:px-6 md:py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                name="oldPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña anterior</FormLabel>
                    <FormControl>
                      <SimplePasswordInput
                        className="bg-background/50 ring-main/40 hover:ring-4"
                        field={field}
                        isSubmitting={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        label="Nueva contraseña"
                        isSubmitting={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-3 pb-2 text-end space-x-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  variant="primary"
                >
                  {isSubmitting && (
                    <Loader className="animate-spin" />
                  )}
                  Cambiar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
