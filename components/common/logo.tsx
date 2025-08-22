"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface LogoProps {
  dark?: boolean;
}

export function Logo({ dark }: LogoProps) {
  const pathname = usePathname();

  return (
    <Link href="/" className="select-none flex items-center gap-2">
      {pathname === "/" && !dark && (
        <Image
          src="/images/parkio-logo.svg"
          alt="Parkio logo"
          width={100}
          height={100}
          className="h-9 w-auto"
        />
      )}
      {!dark && pathname !== "/" && (
        <Image
          src="/images/parkio-logo.svg"
          alt="Parkio logo"
          width={100}
          height={100}
          className="block dark:hidden h-9 w-auto"
        />
      )}
      {dark && (
        <Image
          src="/images/parkio-logo-dark.svg"
          alt="Parkio logo"
          width={100}
          height={100}
          className={cn(
            "hidden dark:block h-9 w-auto",
            dark && "block dark:block"
          )}
        />
      )}
    </Link>
  );
}
