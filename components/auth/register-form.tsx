"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { FormStateMessage } from "@/components/auth/form-state-message";
import { register } from "@/actions/auth";
import { FormWrapper } from "./form-wrapper";
import { Separator } from "../ui/separator";
import { PasswordInput } from "./password-input";

export function RegisterForm() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      parkingName: "",
      complaintsAndSuggestionsMail: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    try {
      const { error, success } = await register(values);

      if (error) {
        setError(error);
      }

      if (success) {
        form.reset();
      }
    } catch {
      // toast.error("Algo salió mal!");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full min-h-full">
      <FormWrapper
        headerTitle="Nuevo Parqueadero"
        headerSubtitle="Crea un nuevo espacio para la administración de un nuevo negocio"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4 mt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del propietario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre"
                        disabled={isSubmitting}
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
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="Introduce la contraseña"
                        isSubmitting={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <div className="ss:flex items-center gap-3 max-ss:space-y-3">
                <FormField
                  control={form.control}
                  name="parkingName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nombre del parqueadero</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduce el nombre aqui..."
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complaintsAndSuggestionsMail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Correo de PQRs</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Introduce el correo aqui..."
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormStateMessage type="Success" message={success} />
              <FormStateMessage type="Error" message={error} />

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
                  Crear negocio
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </FormWrapper>
    </div>
  );
}
