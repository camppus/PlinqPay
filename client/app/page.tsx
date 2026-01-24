import { Header, Striped } from "@/components/LandingPage/Header";
import { Hero } from "@/components/LandingPage/Hero/page";
import { InfiniteImageScroller } from "@/components/ui/infinite-moving-cards";

const enterprises = [
  "https://kissalo.onrender.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FwhiteLogo.c0b1d317.png&w=3840&q=75",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
  "https://kissalo.onrender.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FwhiteLogo.c0b1d317.png&w=3840&q=75",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
];

export default function Home() {
  return (
    <div className="flex flex-col gap-5 min-h-screen relative pb-40">
      <span className="fixed h-screen border border-dashed top-0  z-455 left-50 lg:flex hidden"></span>
      <span className="fixed h-screen border border-dashed top-0  z-455 right-50 lg:flex hidden"></span>
      <span className="fixed w-full border border-dashed top-20 z-455  lg:flex hidden"></span>
      <Header />
      <Hero />

      <span className="relative mt-14 min-h-20">
        <span className="absolute w-full border border-dashed top-0   lg:flex hidden"></span>
        <span className="absolute w-full border border-dashed bottom-0   lg:flex hidden"></span>

        <div className="flex   justify-between">
          <Striped alt={"50"} />

          <span className="flex-1 flex lg:flex-row flex-col justify-between items-center px-4">
            <div className="flex lg:text-3xl text-2xl lg:text-start text-center  opacity-55 lg:w-[30%]  lg:mb-0 mb-4 w-full  lg:items-center h-full">
              <h1>Estamos em grandes projetos como:</h1>
              <span className="absolute h-full border right-0 top-0  border-dashed"></span>
            </div>
            <div className="flex-1 ">
              <InfiniteImageScroller items={enterprises} />
            </div>
          </span>
          <Striped alt={"50"} />
        </div>
      </span>

      <div className="flex lg:flex-row flex-col gap-4 justify-between lg:items-center px-6 lg:px-55 mt-20">
        <span className="lg:w-[40%]">
          <h1 className="scroll-m-20  lg:text-5xl text-3xl lg:text-start text-center  tracking-tight text-balance">
            Processando e atendendo milhões de clientes.
          </h1>
        </span>

        <span className="grid grid-cols-2 gap-10 lg:gap-40 lg:mt-0 mt-10">
          <div>
            <h1 className="scroll-m-20 text-blue-800  lg:text-5xl text-4xl font-semibold tracking-tight text-balance">
              <span className="text-white">+</span> 1M
            </h1>
            <p>Ja foram transacionado</p>
          </div>

          <div>
            {" "}
            <h1 className="scroll-m-20 text-blue-800  lg:text-5xl text-4xl font-semibold tracking-tight text-balance">
              <span className="text-white">+</span> 100
            </h1>
            <p>De clientes ao dia</p>
          </div>
        </span>
      </div>
    </div>
  );
}
