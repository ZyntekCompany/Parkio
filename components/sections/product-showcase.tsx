import Image from "next/image";
import productImage from "@/public/images/product.png";
import tubeImage from "@/public/images/tube.png";
import pyramidImage from "@/public/images/pyramid.png";

export function ProductShowcase() {
  return (
    <section className="bg-gradient-to-b from-[#FFF] to-[#D2DCFF] py-24 overflow-x-clip">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Eficiencia Total</div>
          </div>
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            Tu parqueadero <br /> siempre bajo control
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
            Optimiza tu operación con un sistema que se adapta a las necesidades de tu negocio.
          </p>
        </div>
        <div className="relative">
          <Image src={productImage} alt="Product image" className="mt-10 z-20 rounded-lg" />
          <Image
            src={pyramidImage}
            alt="Pyramid image"
            height={262}
            width={262}
            className="hidden md:block absolute -right-36 -top-32 z-50"
          />
        </div>
      </div>
    </section>
  );
}
