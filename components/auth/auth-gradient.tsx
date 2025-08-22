import Image from "next/image";

export function AuthGradient() {
  return (
    <div className="flex-1 relative overflow-hidden hidden lg:block">
      <div className="absolute block dark:hidden inset-0 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_50%)]"></div>
      <div
        className="absolute hidden dark:block inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #1e3a8a 80%)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-center items-start h-full px-12 py-16">
        {/* Main Content */}
        <div className="max-w-lg space-y-8 z-20">
          {/* Hero Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-b from-gray-900 to-blue-800 dark:from-white dark:to-blue-400 text-transparent bg-clip-text mt-6">
              Gestiona tu parqueadero como nunca antes
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl tracking-tight text-slate-700 dark:text-slate-400 mt-6">
            Administra todos los aspectos de tu parqueadero desde cualquier
            lugar. Accede a reportes, controla tu personal y toma decisiones
            inteligentes con una plataforma segura y moderna.
          </p>

          {/* Features List */}
          <div className="space-y-4 mt-12">
            <div className="flex items-center gap-4 group">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Acceso multiusuario
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Personaliza permisos y roles para todo tu equipo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reportes y estadísticas en tiempo real
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Visualiza el desempeño de tu negocio y toma decisiones
                  informadas.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Image
          src="/images/cog.png"
          alt="Parking image"
          width={600}
          height={600}
          className="absolute hidden xl:block md:h-full md:w-auto md:max-w-none -right-[72%]"
        />
      </div>
    </div>
  );
}
