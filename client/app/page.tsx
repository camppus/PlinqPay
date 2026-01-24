import { FloatingLanguageImages } from "@/components/LandingPage/FLoating";
import { Header, Striped } from "@/components/LandingPage/Header";
import { Hero } from "@/components/LandingPage/Hero/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfiniteImageScroller } from "@/components/ui/infinite-moving-cards";
import ShinyText from "@/components/ui/ShinyText";
import {
  ArrowRight,
  ArrowUpCircle,
  Coins,
  CreditCard,
  Phone,
  Users,
  Wallet,
  Webhook,
} from "lucide-react";

const enterprises = [
  "https://kissalo.onrender.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FwhiteLogo.c0b1d317.png&w=3840&q=75",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
  "https://kissalo.onrender.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FwhiteLogo.c0b1d317.png&w=3840&q=75",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
  "http://noticiasangola.free.nf/wp-content/uploads/2025/07/nubla-logo-2.png",
];

const integrations = [
  {
    icon: <CreditCard />,
    title: "Pagamentos via referência",
    description:
      "Permite transferências instantâneas e seguras via referência, integradas ao seu sistema em tempo real.",
  },
  {
    icon: <Webhook />,
    title: "Callback URL",
    description:
      "Receba notificações automáticas em tempo real sobre o status das transações diretamente no seu sistema.",
  },
  {
    icon: <Wallet />,
    title: "Registo de carteira",
    description:
      "Crie e gerencie carteiras digitais para seus usuários, com controle de saldo, histórico e segurança total.",
  },
  {
    icon: <Coins />,
    title: "Saque instantâneo",
    description:
      "Realize saques imediatos de forma simples e segura, garantindo liquidez e rapidez para seus clientes.",
  },
];

const techs = [
  { label: "JavaScript", className: "top-5 left-10" },
  { label: "TypeScript", className: "top-20 right-16" },
  { label: "Node.js", className: "bottom-24 left-20" },
  { label: "REST API", className: "bottom-10 right-10" },
  { label: "Webhook", className: "top-1/2 left-5" },
];

const testimonials = [
  {
    name: "Carlos Mendes",
    role: "CTO · Fintech",
    message:
      "A PlinqPay simplificou totalmente nossa integração de pagamentos. Rápido, seguro e confiável.",
  },
  {
    name: "Ana Silva",
    role: "Founder · Startup",
    message:
      "Integramos a API em poucas horas. Os callbacks funcionam perfeitamente.",
  },
  {
    name: "João Pereira",
    role: "Dev Backend",
    message:
      "Documentação clara e suporte excelente. A PlinqPay virou nosso padrão.",
  },
  {
    name: "Mariana Costa",
    role: "Product Manager",
    message: "Processamos milhares de pagamentos sem nenhuma dor de cabeça.",
  },
  {
    name: "Lucas Rocha",
    role: "Engenheiro de Software",
    message:
      "A estabilidade da API é impressionante. Ideal para sistemas críticos.",
  },
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

        <div className="flex  justify-between">
          <Striped alt={"50"} />
          <span className="flex-1 flex lg:flex-row flex-col justify-between items-center gap-5 px-4">
            <div className="flex  relative lg:text-4xl text-4xl lg:text-start lg:w-[30%]  lg:mb-0 mb-4 text-center lg:h-full">
              <ShinyText
                text="Estamos em grandes projectos como"
                speed={2}
                delay={0}
                color="#b5b5b5"
                shineColor="#ffffff"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
                disabled={false}
                className="font-bold lg:mt-10"
              />
              <span className="absolute hidden lg:flex  z-455 h-full border right-0 top-0  border-dashed"></span>
            </div>
            <div className="flex-1 ">
              <InfiniteImageScroller items={enterprises} />
            </div>
          </span>
          <Striped alt={"50"} />
        </div>
      </span>

      <span className=" flex flex-col gap-5 lg:px-55 pt-20 px-5">
        <div className="text-center lg:text-5xl text-4xl">
          <ShinyText
            text="Atendendo milhões de clientes."
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="font-bold"
          />
        </div>

        <aside className="grid lg:grid-cols-4 grid-cols-2 border-dashed border-y mt-10 lg:px-10">
          {integrations.map((item, idx) => (
            <span
              className="flex relative flex-col border-l border-dashed h-full p-10 px-4 last:border-r"
              key={idx}
            >
              <span className="absolute -left-1 bottom-[62%] border h-4 bg-blue-500"></span>
              <div className=" flex flex-col gap-5 w-full">
                {item.icon}
                <h1 className="text-xl font-semibold">{item.title}</h1>
                <p className="opacity-70 text-sm">{item.description}</p>
              </div>
            </span>
          ))}
        </aside>
      </span>
      <span className=" flex flex-col gap-5 lg:px-55 pt-30 px-6">
        <div className="flex flex-col text-center gap-4 justify-center  items-center relative">
          <FloatingLanguageImages />
          <Badge variant={"outline"}>
            <Webhook />
            Itegrações
          </Badge>

          <span className="relative lg:text-5xl text-4xl opacity-90 hover:opacity-100 font-bold flex  flex-col   gap-4   lg:items-center h-full">
            <p>Integre como quiser! </p>
            <p>Code , vide-code , no-code!</p>
          </span>
          <p className="lg:w-full md:w-[40%]">
            Desenvolva, automatize ou conecte sem complicações. Nossa API se
            adapta a qualquer nível técnico, do código ao no-code.
          </p>
          <Button className="rounded-full text-white  mt-5" size={"lg"}>
            Veja nossa documentação{" "}
            <ArrowUpCircle
              fill="white"
              className="text-blue-500 rotate-45"
            />{" "}
          </Button>
        </div>
      </span>

      <span className=" flex flex-col gap-5 lg:px-55 mt-40 pt-40 border-dashed border-t px-6">
        <div className="flex flex-col text-center gap-4 justify-center  items-center relative">
          <Badge variant={"outline"}>
            <Users />
            Depoimentos
          </Badge>

          <span className="relative md:w-[50%] w-full lg:text-5xl text-4xl font-bold flex  flex-col   gap-4   lg:items-center h-full">
            Histórias reais de quem usa a Pliqpay no dia a dia.
          </span>
          <p>
            Veja relatos de clientes que simplificaram pagamentos e gerenciaram
            suas transações com facilidade usando a Abacate.
          </p>
        </div>

        <div className="relative overflow-hidden py-16">
          {/* BLUR NAS EXTREMIDADES */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-10" />

          {/* FILA 1 → */}
          <div className="flex gap-6 w-max marquee-left">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`top-${i}`} {...t} />
            ))}
          </div>

          {/* FILA 2 ← */}
          <div className="flex gap-6 w-max mt-8 marquee-right">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`bottom-${i}`} {...t} />
            ))}
          </div>
        </div>
      </span>

      <span className="grid lg:grid-cols-2 lg:px-55 mt-20 pt-10 px-6 gap-10">
        <article>
          <img
            src="https://www.abacatepay.com/_next/static/media/imagesupport.21600be7.svg"
            alt=""
            className="grayscale-100 rounded-md"
          />
        </article>
        <article>
          <div className="flex flex-col gap-6  lg:pt-10">
            <Badge variant={"outline"}>
              <Phone />
              Suporte
            </Badge>
            <h1 className="lg:text-5xl text-4xl font-bold ">
              E tudo isso com um suporte que não te deixa na mão.
            </h1>
            <p>
              Na Pliqpay, você conta com diferentes canais para receber
              atendimento rápido e eficiente.
            </p>
            <Button variant={"link"} className="text-blue-500 w-40">
              Entre em contacto <ArrowRight />
            </Button>
          </div>
        </article>
      </span>
      <span className="grid lg:grid-cols-2 lg:px-55 mt-20 pt-40 px-6 gap-10">
        <article>
          <div className="flex flex-col gap-6  ">
            <h1 className="lg:text-5xl text-4xl font-bold ">
              Tem dúvidas? Relaxa, nós temos as respostas.
            </h1>
            <p>
              Selecionamos algumas dúvidas que recebemos com frequência sobre
              nossos serviços, elas podem ser úteis para você!
            </p>
          </div>
        </article>
        <article>
          <img
            src="https://www.abacatepay.com/_next/static/media/imagesupport.21600be7.svg"
            alt=""
            className="grayscale-100 rounded-md"
          />
        </article>
      </span>
    </div>
  );
}

function TestimonialCard({ name, role, message }: any) {
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-w-70 max-w-70 bg-background/80 backdrop-blur border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      <p className="text-sm opacity-80">{message}</p>
    </div>
  );
}
