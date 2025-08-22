import { navLinks } from "@/constants/landing";
import Link from "next/link";

import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { Logo } from "@/components/common/logo";

export function Footer() {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        <div className="flex justify-center">
          <Logo dark />
        </div>
        <nav className="flex flex-col md:flex-row justify-center gap-6 mt-10">
          {navLinks.map(({ label, href }, i) => (
            <Link key={i} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center gap-6 mt-6">
          <FaXTwitter className="size-5" />
          <FaInstagram className="size-5" />
          <FaFacebook className="size-5" />
        </div>
        <p className="mt-6">
          &copy; {new Date().getFullYear()} Parking System. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
