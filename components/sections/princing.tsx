import { pricingPlans } from "@/constants/landing";
import { PricingCard } from "@/components/common/pricing-card";

export function Princing() {
  return (
    <section id="pricing" className="bg-gradient-to-b py-24 overflow-x-clip">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Planes flexibles</div>
          </div>
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            Elige el plan perfecto para tu negocio
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
            Elige la opción que mejor se adapta a tu negocio y paga solo por las
            funciones que realmente necesitas, sin costos ocultos ni letras
            pequeñas.
          </p>
        </div>

        <div className="flex flex-col gap-5 self-stretch lg:flex-row mt-12">
          {pricingPlans.map((plan, i) => (
            <PricingCard key={i} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
