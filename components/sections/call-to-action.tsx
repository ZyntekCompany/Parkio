import { ArrowRight } from "lucide-react";
import star from "@/public/images/star.png";
import spring from "@/public/images/spring.png";
import Image from "next/image";
import Link from "next/link";

export function CallToAction() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-hidden"
    >
      <div className="container">
        <div className="max-w-[1000px] mx-auto relative">
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            Empieza a transformar tu negocio hoy
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
            Regístrate y comienza a usar la plataforma que simplifica la
            administración, mejora el control y te ayuda a crecer con tecnología
            inteligente.
          </p>
          <Image
            src={star}
            alt="Star image"
            width={360}
            className="hidden md:block absolute -left-[350px] -top-[128px]"
          />
          <Image
            src={spring}
            alt="Spring image"
            width={360}
            className="hidden md:block absolute -right-[331px] -top-[19px]"
          />
          <div className="flex justify-center mt-10 gap-2">
            <Link
              href="/login"
              className="bg-black text-white inline-flex px-4 py-2 rounded-lg font-medium"
            >
              ¡Empieza hoy!
            </Link>
            <Link
              href="https://wa.me/573157243515?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20demostraci%C3%B3n%20de%20la%20plataforma.%20%C2%BFMe%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n%20sobre%20las%20funcionalidades%20y%20el%20proceso%3F"
              className="text-black inline-flex px-4 py-2 rounded-lg font-medium gap-1"
            >
              <span>Solicita una demo</span> <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
