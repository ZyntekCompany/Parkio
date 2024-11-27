import { Logo } from "@/components/common/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 h-full overflow-hidden">
      <div className="hidden md-plus:flex flex-col justify-between w-[38%] 2xl:w-[40%] min-w-[480px]  bg-gradient-to-r from-violet-600 to-indigo-600 ">
        <Logo
          dinamicTextColor
          name="Parking NoA"
          fill="#fefeff"
          className="py-12 px-9"
        />

        <div className="text-[#fefeff] py-12 px-9 space-y-8">
          <h2 className="xl:text-[43px] text-4xl xl:leading-none">
            Gestiona Facilmente tu Parqueadero
          </h2>
          <p className="text-[#fefeffd7] text-xl font-light w-[90%] xl:w-[86%] 2xl:w-[90%]">
            Lleva el control de clientes y optimiza el flujo en tu parqueadero —{" "}
            <span className="italic">todo en un solo lugar</span>.
          </p>
        </div>
      </div>
      <div className="flex-1 lg:py-12 max-lg:py-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
