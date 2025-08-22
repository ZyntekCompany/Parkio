import { features } from "@/constants/landing";

export function Features() {
  return (
    <section id="features" className="bg-gradient-to-b py-24 overflow-x-clip">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Potencia total</div>
          </div>
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            Soluciones que impulsan tu negocio
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
            Administra tu parqueadero con precisión y eficiencia usando
            herramientas inteligentes, analíticas en tiempo real y reportes
            potenciados por IA.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5 mt-12">
          {features.map(({ title, description, Icon }, i) => (
            <article
              key={i}
              className="relative flex flex-col gap-4 rounded-lg border border-accent-foreground/15 overflow-hidden p-4 [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset]"
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `
                  linear-gradient(to right, #d1d5db 1px, transparent 1px),
                  linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
                `,
                  backgroundSize: "32px 32px",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
                  maskImage:
                    "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
                }}
              />
              <figure className="flex size-9 items-center justify-center rounded-full border border-accent-foreground/15 bg-muted p-2 z-20 ring-4 ring-white">
                <Icon />
              </figure>
              <div className="flex flex-col items-start gap-1 z-10">
                <h5 className="dark:text-secondary text-lg font-semibold tracking-tight">
                  {title}
                </h5>
                <p className="text-pretty dark:text-secondary/80">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
