import Link from "next/link";
import { DesktopMenu, MobileMenu } from "@/components/common/navigation-menu";
import { Logo } from "@/components/common/logo";
import { navLinks } from "@/constants/landing";

export const Header = () => {
  const buttons =
    [
      {
        label: "Ingresar",
        href: "/login",
        variant: "secondary" as "secondary",
      },
    ];

  return (
    <header className="arial-font sticky left-0 top-0 z-[110] flex w-full flex-col border-b md:border-none bg-white md:backdrop-blur-xl">
      <div className="flex h-[64px]">
        <div className="container mx-auto flex items-center justify-between lg:grid lg:grid-cols-[1fr_max-content_1fr] place-items-center content-center px-6">
          <Link href="#hero">
            <Logo />
          </Link>
          <DesktopMenu links={navLinks} buttons={buttons} />
          <MobileMenu links={navLinks} buttons={buttons} />
        </div>
      </div>
    </header>
  );
};
