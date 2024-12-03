"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Loader, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/actions/profile-user";
import { Label } from "@/components/ui/label";
import UploadImageButton from "./upload-image-button";
import { UserDataSchema } from "@/schemas/user-account";

interface GeneralInfoProps {
  user: User;
}

export function GeneralInfo({ user }: GeneralInfoProps) {
  const [edit, setEdit] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UserDataSchema>>({
    resolver: zodResolver(UserDataSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof UserDataSchema>) => {
    try {
      const response = await updateUserProfile(values);

      if (response.error) {
        toast.error(response.error);
      }

      if (response.success) {
        setEdit(false);
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("Algo salió mal!");
    }
  };

  return (
    <Card className="max-xs:p-0 dark:bg-muted/20 bg-muted-foreground/5 space-y-0 py-2">
      <div className="flex flex-col sm:flex-row max-sm:items-start justify-between max-sm:gap-4 px-4 pt-4 pb-2 md:px-6 md:py-3">
        <CardHeader className="p-0">
          <CardTitle>Información General</CardTitle>
          <CardDescription>
            Realice cambios en su cuenta aquí. Haz click en guardar cuando estés
            listo.
          </CardDescription>
        </CardHeader>
        {!edit && (
          <Button
            onClick={() => setEdit((prev) => !prev)}
            className="max-sm:w-full text-center bg-zinc-300/70 hover:bg-zinc-300 dark:hover:bg-zinc-500/65 text-primary dark:bg-zinc-500/50 dark:text-white sm:bg-transparent sm:dark:bg-transparent sm:hover:bg-accent sm:hover:text-accent-foreground"
          >
            <Pencil className="size-4 sm:text-primary max-sm:mr-2" />
            <span className="sm:hidden">Editar</span>
          </Button>
        )}
      </div>
      <CardContent className="space-y-2 p-4 md:px-6 md:py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {edit && <UploadImageButton userImage={user.image} />}

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    {edit && (
                      <FormControl>
                        <Input
                          className="bg-background/50 ring-main/40 hover:ring-4"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                    )}
                    {!edit && (
                      <p className="text-accent-foreground/80 text-[15px]">
                        {field.value}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    {edit && (
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ej. jhon@gmail.com"
                          disabled
                          {...field}
                        />
                      </FormControl>
                    )}
                    {!edit && (
                      <p className="text-accent-foreground/80 text-[15px]">
                        {field.value}
                      </p>
                    )}
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
                    {edit && (
                      <FormControl>
                        <Input
                          type="tel"
                          className="bg-background/50 ring-main/40 hover:ring-4"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                    )}
                    {!edit && (
                      <p className="text-accent-foreground/80 text-[15px]">
                        {field.value}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!edit && (
                <div>
                  <Label>Rol</Label>
                  <p className="text-accent-foreground/80 text-[15px]">
                    {user.role === "Empleado"
                      ? "Encargado de turno"
                      : "Administrador"}
                  </p>
                </div>
              )}

              {edit && (
                <div className="pt-3 pb-2 text-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEdit((prev) => !prev)}
                    className="font-semibold rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting && <Loader className="animate-spin" />}
                    Guardar cambios
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
