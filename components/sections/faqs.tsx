import { faqs } from "@/constants/landing";

export function FAQs() {
  return (
    <section id="faqs" className="bg-gradient-to-b py-24 overflow-x-hidden">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">FAQs</div>
          </div>

          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            Preguntas frecuentes
          </h2>

          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
            Consejos y respuestas de nuestro equipo.
          </p>
        </div>

        <div className="mx-auto flex w-full grid-cols-3 flex-col place-content-start items-start gap-8 self-stretch lg:grid lg:gap-14 mt-12">
          {faqs.map((faq) => (
            <li key={faq.title} className="flex flex-col gap-1.5">
              <p className="dark:text-secondary font-semibold leading-relaxed tracking-tighter sm:text-lg">
                {faq.title}
              </p>
              <p className="dark:text-secondary/80 text-sm leading-relaxed tracking-tight sm:text-base">
                {faq.answer}
              </p>
            </li>
          ))}
        </div>
      </div>
    </section>
  );
}
