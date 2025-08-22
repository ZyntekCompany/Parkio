"use client";

import * as React from "react";
import clsx from "clsx";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  sublinks?: { label: string; href: string }[];
}

interface Button {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

// Estilos básicos
const linkStyles =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors text-neutral-700 hover:bg-gray-100";
const buttonStyles = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors",
  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-colors",
};

export function DesktopMenu({
  links,
  buttons,
}: {
  links: NavLink[];
  buttons: Button[];
}) {
  return (
    <>
      {/* Enlaces de navegación */}
      <nav className="hidden lg:flex items-center gap-1">
        {links.map((link) => (
          <NavItem key={link.href} {...link} />
        ))}
      </nav>

      {/* Botones del lado derecho */}
      <div className="hidden lg:flex items-center gap-2">
        {buttons.map((button) => (
          <Link
            key={button.href}
            href={button.href}
            className={buttonStyles[button.variant || "primary"]}
          >
            {button.label}
          </Link>
        ))}
      </div>
    </>
  );
}

function NavItem({ label, href, sublinks }: NavLink) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!sublinks || sublinks.length === 0) {
    return (
      <Link href={href} className={linkStyles}>
        {label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link href={href} className={clsx(linkStyles, "pr-2")}>
        {label}
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
          {sublinks.map((sublink) => (
            <Link
              key={sublink.href}
              href={sublink.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {sublink.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileMenu({
  links,
  buttons,
}: {
  links: NavLink[];
  buttons: Button[];
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4 flex flex-col gap-2">
            {links.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
                {link.sublinks && (
                  <div className="ml-4 flex flex-col gap-1">
                    {link.sublinks.map((sublink) => (
                      <Link
                        key={sublink.href}
                        href={sublink.href}
                        className="block py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex flex-col gap-2">
              {buttons.map((button) => (
                <Link
                  key={button.href}
                  href={button.href}
                  className={clsx(
                    "text-center",
                    button.variant === "secondary"
                      ? buttonStyles.secondary
                      : buttonStyles.primary
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {button.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
