"use client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import NotificationService from "@/services/Notification";
import constants from "@/constants";

export default function ComapnieLayout({ children }: { children: ReactNode }) {
  const [unred, setUnread] = useState(0);
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [once, setOnce] = useState(false);

  useEffect(() => {
    async function get() {
      const token = localStorage.getItem("token") as string;
      const data = await new NotificationService(token).getUnread();
      if (canPlaySound && data?.data != unred && !once) {
        const audio = new Audio("/song.mp3");
        audio.play();
        setOnce(true);
      }
      setUnread(data?.data ?? 0);
    }

    get();
    const interval = setInterval(async () => {
      await get();
    }, constants.TIMEOUT_LOADER);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const enableSound = () => {
      setCanPlaySound(true);
      window.removeEventListener("click", enableSound);
    };

    window.addEventListener("click", enableSound);
    return () => window.removeEventListener("click", enableSound);
  }, []);

  const { theme, setTheme } = useTheme();
  const navs = [
    {
      title: "Inicial",
      icon: <i className="fi fi-rr-house-chimney-window"></i>,
      to: "/dashboard/companie",
    },
    {
      title: "Chaves",
      icon: <i className="fi fi-rr-webhook" />,
      to: "/dashboard/companie/key",
    },
    {
      title: "Saques",
      icon: <i className="fi fi-rr-sack-dollar" />,
      to: "/dashboard/companie/widthdrawls",
    },
    {
      title: "Definições",
      icon: <i className="fi fi-rr-settings" />,
      to: "/dashboard/companie/profile",
    },
  ];

  const [active, setACtive] = useState(0);

  return (
    <main className="flex flex-col gap-4">
      <header className="fixed z-33 flex items-center border-b justify-between w-full left-0 top-0 md:p-4 px-3 py-2 bg-transparent backdrop-blur-xl">
        <Logo />
        <div>
          <Link
            href={"/dashboard/companie/notification"}
            className="relative dark:*:text-white animate-pulse"
          >
            <Button size={"lg"} variant={unred > 0 ? "default" : "ghost"}>
              <Bell />
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="hover:bg-transparent dark:hover:bg-transparent opacity-80 hover:opacity-100"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 scale-100 transition-all dark:scale-0" />
            <Moon className="absolute h-5 w-5 scale-0 transition-all dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <section className="min-h-screen md:py-30 py-22 md:px-4 px-2">
        {children}
      </section>
      <footer className="fixed z-3 flex bottom-0 left-0 justify-center items-center  w-full  min-h-17 md:py-4 p-2 ">
        <span className=" grid grid-cols-4  gap-5 w-full   xl:w-[35%]  md:w-[90%]  border dark:border-white/4 p-2 md:p-4 rounded-full bg-transparent backdrop-blur-3xl">
          {navs.map((item, idx) => (
            <Link
              href={item.to}
              key={idx}
              onClick={() => {
                setACtive(idx);
              }}
              className={clsx(
                "transition-all opacity-50  hover:scale-90 flex gap-2 justify-center  items-center  border p-2 px-3 rounded-full",

                {
                  "bg-blue-500 text-white border-blue-500 opacity-100":
                    active == idx,
                },
              )}
            >
              {item.icon}
              <p
                className={clsx("hidden", {
                  "md:flex": active == idx,
                  "md:hidden": active != idx,
                })}
              >
                {item.title}
              </p>
            </Link>
          ))}
        </span>
      </footer>
    </main>
  );
}
