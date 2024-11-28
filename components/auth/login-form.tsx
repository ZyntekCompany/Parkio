"use client";

import { z } from "zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas/auth";
import { FormWrapper } from "@/components/auth/form-wrapper";
import { PasswordInput } from "@/components/auth/password-input";
import { FormStateMessage } from "@/components/auth/form-state-message";
import { login } from "@/actions/auth";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | undefined>(undefined);

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correo ya está en uso con otra cuenta!"
      : "";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      const response = await login(values);

      if (response?.error) {
        setError(response.error);
        form.resetField("password");
      }

      if (!response?.error) {
        form.reset();
      }
    } catch {
      toast.error("Ocurrió un problema con tu solicitud.");
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center w-full min-h-full">
      <FormWrapper
        headerTitle="Iniciar sesión"
        headerSubtitle="Introduce tu correo y contraseña para acceder"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 mt-6">
              <FormField
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Introduce tu correo"
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
                        placeholder="Introduce tu contraseña"
                        isSubmitting={isSubmitting}
                        className={cn(
                          fieldState.invalid &&
                            "focus-visible:ring-[#ef4444] border-[#ef4444]"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormStateMessage type="Error" message={error || urlError} />

              <div className="pt-3 pb-2">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !isValid}
                  className="w-full font-semibold rounded-lg"
                >
                  {isSubmitting && (
                    <Loader className="h-5 w-5 animate-spin" />
                  )}
                  Iniciar sesión
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </FormWrapper>
    </div>
  );
}
