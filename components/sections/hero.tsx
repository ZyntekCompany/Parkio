import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import cogImage from "@/public/images/cog.png";

export function Hero() {
  return (
    <section className="pt-10 pb-20 md:pt-14 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_50%)] overflow-x-clip">
      <div className="container">
        <div className="md:flex justify-center gap-4">
          <div className="md:w-[720px] md:min-w-[478px]">
            <div className="tag">Innovación para tu parqueadero</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6">
              Gestiona tu parqueadero como nunca antes
            </h1>
            <p className="text-xl tracking-tight text-[#010D3E] mt-6">
              Optimiza tu operación, controla tu negocio desde cualquier lugar y
              toma decisiones con datos reales. Lleva la administración de tu
              parqueadero al siguiente nivel.
            </p>
            <div className="flex items-center gap-1 mt-[30px]">
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
          <div className="relative mt-20 md:mt-0 md:h-[648px]">
            <Image
              src={cogImage}
              alt="Parking image"
              className="md:h-full md:w-auto md:max-w-none md:-left-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
