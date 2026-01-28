"use client";

import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Lock, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full lg:pt-40 pt-30 lg:px-65 grid lg:grid-cols-2 gap-4 px-6">
      <article className="flex flex-col gap-10">
        <SocialProof />
        <h1 className="scroll-m-20  lg:text-8xl text-6xl font-extrabold tracking-tight text-balance">
          Receba fácil. Cresça
          <span className="text-blue-500">
            <BlurText
              text="Rápido!"
              delay={200}
              animateBy="words"
              direction="top"
            />
          </span>
        </h1>
        <p className="opacity-80">
          Infraestrutura de pagamentos em poucas linhas. Feito de devs para
          devs.
        </p>

        <span className="grid lg:grid-cols-2 gap-3">
          <a href="/docs">
            <Button className="text-white w-full">
              Integre ao seu negócio
              <ArrowUpCircle className="text-blue-500 rotate-45" fill="white" />
            </Button>
          </a>
          <Button
            variant={"outline"}
            className="w-full opacity-80 hover:opacity-100"
          >
            Por que usar ?
          </Button>
        </span>

        <span className="grid grid-cols-2 gap-4">
          <div className="flex gap-2 lg:flex-row flex-col lg:items-center">
            <span className="text-blue-900 bg-blue-500/10 rounded-full h-10 w-10 flex justify-center items-center">
              <Zap />
            </span>
            <span className="flex flex-col ">
              <strong className="text-blue-500">Rápido</strong>
              <small className="opacity-70">
                Integre em minutos, não dias.
              </small>
            </span>
          </div>
          <div className="flex gap-2 lg:flex-row flex-col lg:items-center">
            <span className="text-blue-900 bg-blue-500/10 rounded-full h-10 w-10 flex justify-center items-center">
              <Lock />
            </span>
            <span className="flex flex-col ">
              <strong className="text-blue-500">Seguro</strong>
              <small className="opacity-70">Criptografia de ponta</small>
            </span>
          </div>
        </span>
      </article>
      <article className="relative flex  overflow-hidden rounded-2xl">
        <div
          className="
      absolute inset-0
      bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_0%)]
      blur-3xl
    "
        />
        <div
          className="
      absolute inset-0
      bg-[radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.25),transparent_55%)]
      blur-3xl
    "
        />
        <div
          className="
      relative
    "
        >
          <img
            src="/dash.jpg"
            alt=""
            className="
        w-full dark:opacity-50
        object-cover
        h-full  dark:grayscale-100
        rounded-sm
      "
          />
        </div>
      </article>
    </section>
  );
}

export function SocialProof() {
  const users = [
    "https://i.pravatar.cc/100?img=12",
    "https://i.pravatar.cc/100?img=32",
    "https://i.pravatar.cc/100?img=42",
    "https://i.pravatar.cc/100?img=62",
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {users.map((src, index) => (
          <img
            key={index}
            src={src}
            className="
              lg:h-7 lg:w-7
              h-5 w-5
              rounded-full
              object-cover
              shadow-sm
              bg-blue-500
              border border-white
            "
          />
        ))}
      </div>

      {/* Texto */}
      <span className="text-xs opacity-80">
        Mais de <strong className="text-blue-500 font-semibold">2.000+</strong>{" "}
        empresas confiam
      </span>
    </div>
  );
}
