import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export function Logo() {
  return (
    <Link href="/" className="select-none flex items-center gap-2">
      <Image
        src="/images/parkio-logo.svg"
        alt="Parkio logo"
        width={100}
        height={100}
        className="block dark:hidden h-9 w-auto"
      />
      <Image
        src="/images/parkio-logo-dark.svg"
        alt="Parkio logo"
        width={100}
        height={100}
        className="hidden dark:block h-9 w-auto"
      />
    </Link>
  );
}
