"use client";

import { ReactNode, useEffect, useState } from "react";
import bg from "@/assets/bg.jpeg";
import logo from "@/assets/logo.png";
import Image from "next/image";
import clsx from "clsx";
import { useTheme } from "next-themes";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <section className="grid min-h-screen w-screen p-1 px-6 lg:px-1 md:px-30 lg:pt-0 pt-20 lg:grid-cols-2 gap-2">
      <article className="overflow-hidden  text-white lg:flex hidden rounded-lg relative">
        <Image
          src={bg}
          alt="bg"
          className={clsx("h-full w-full absolute ", {
            "grayscale-100": theme === "dark",
          })}
        />

        <span className="z-4 absolute top-20 flex flex-col gap-5 left-8">
          <Image src={logo} alt="logo" className="h-10 w-40" />
          <h1 className="scroll-m-20  lg:text-6xl lg:w-[80%] font-extrabold tracking-tight text-balance">
            Seu próximo destino começa aqui
          </h1>
          <p className="text-lg opacity-80">
            Acesse sua conta e descubra novas formas de viajar com o Plinkpay.
          </p>
        </span>
      </article>

      {children}
    </section>
  );
}
