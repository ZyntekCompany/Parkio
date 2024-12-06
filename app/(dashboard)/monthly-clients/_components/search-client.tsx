"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Loader, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { getLatestInactiveMonthlyClient } from "@/actions/monthly-clients";
import { ExtendedClient } from "@/types";
import { formatColombianDate } from "@/utils/format-colombian-date";
import { cn } from "@/lib/utils";

const animationProps = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};

const SearchClientSchema = z.object({
  query: z.string().min(1),
});

export function SearchClient() {
  const [clientData, setClientData] = useState<ExtendedClient | null>(null);
  const [noResults, setNoResult] = useState(false);

  const form = useForm<z.infer<typeof SearchClientSchema>>({
    resolver: zodResolver(SearchClientSchema),
    defaultValues: {
      query: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function handleSearch(values: z.infer<typeof SearchClientSchema>) {
    try {
      const client = await getLatestInactiveMonthlyClient(values.query);

      if (!client) {
        setNoResult(true);
        setClientData(null);
      } else {
        setNoResult(false);
        setClientData(client);
      }
    } catch {
      toast.error("Algo salió mal en la solicitud.");
    }
  }

  function handleClose() {
    form.setValue("query", "");
    setNoResult(false);
    setClientData(null);
  }

  const CloseButton = ({ className }: { className?: string }) => {
    return (
      <Button
        variant="ghost"
        className={cn(
          "absolute right-2 top-2 size-fit p-1 rounded-full",
          className
        )}
        onClick={handleClose}
      >
        <X className="size-4 text-muted-foreground" />
      </Button>
    );
  };

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          className="sm:flex items-center gap-2 max-sm:space-y-3 w-full"
        >
          <FormField
            name="query"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-3 size-4 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="Buscar por placa o cédula..."
                      className="pl-10"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button disabled={isSubmitting || !isValid} className="max-sm:w-full">
            {isSubmitting && <Loader className="size-4 animate-spin" />}
            Buscar
          </Button>
        </form>
      </Form>

      <AnimatePresence mode="wait">
        {noResults && (
          <motion.div
            {...animationProps}
            className="relative flex max-sm:flex-col items-center gap-2 text-red-400 bg-red-400/25 p-4 rounded-md sm:pr-8"
          >
            <Info className="size-5 shrink-0 mr-2" />
            <p className="max-sm:text-center">
              No se encontraron clientes con los datos proporcionados. Por
              favor, verifique la información e intente nuevamente.
            </p>
            <CloseButton />
          </motion.div>
        )}

        {clientData && (
          <motion.div key="results" {...animationProps}>
            <Card className="bg-card relative">
              <CloseButton className="right-1 top-1" />
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{clientData.name}</span>
                  <Badge variant="secondary" className="mr-2">
                    {clientData.vehicleType.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Cédula
                    </p>
                    <p className="text-sm">{clientData.document}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Placa
                    </p>
                    <p className="text-sm">{clientData.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha Inicio
                    </p>
                    <p className="text-sm">
                      {formatColombianDate(clientData.startDate!, false)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha Fin
                    </p>
                    <p className="text-sm">
                      {formatColombianDate(clientData.endDate!, false)}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Meses de Servicio
                  </p>
                  <p className="text-2xl font-bold">
                    {clientData.monthsReserved}{" "}
                    {clientData.monthsReserved! > 1 ? "meses" : "mes"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
