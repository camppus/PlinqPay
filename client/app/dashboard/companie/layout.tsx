"use client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ReactNode, use, useEffect, useState } from "react";
import NotificationService from "@/services/Notification";
import constants from "@/constants";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { IconLogout } from "@tabler/icons-react";

export default function ComapnieLayout({ children }: { children: ReactNode }) {
  const [unred, setUnread] = useState(0);
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [once, setOnce] = useState(false);
  const { user } = useUser();
  
  async function requestPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}
  

useEffect(() => {
  async function get() {
    const token = localStorage.getItem("token") as string;
    const response = await new NotificationService(token).getUnread();
    const payload = response?.data;
    const newUnread = payload?.value ?? 0;
    const title = payload?.title;
    const body = payload?.body;
    setUnread((prev) => {
      if (canPlaySound && newUnread !== prev) {
        const audio = new Audio("/song.mp3");
        audio.play();
        if (Notification.permission === "granted" && title && body) {
          new Notification(title, {
            body,
            icon:  "https://plinqpay.com/P.png",
          });
        }
      }
      return newUnread;
    });
  }
  get();
  const interval = setInterval(get, constants.TIMEOUT_LOADER);
  return () => clearInterval(interval);
}, [canPlaySound]);
  

  useEffect(() => {
    const enableSound = () => {
      setCanPlaySound(true);
      window.removeEventListener("click", enableSound);
    };

    window.addEventListener("click", enableSound);
    requestPermission();
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

  if (!user) {
    return null;
  }
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
            <Button size={"icon"} variant={unred > 0 ? "default" : "ghost"}>
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

          <Link href={"/auth"}>
            <Button size={"icon"} variant={"destructive"}>
              <IconLogout />
            </Button>
          </Link>
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
              onClick={(e) => {
                if (user.isVerified) {
                  setACtive(idx);
                  return;
                }
                 
                toast.info("Aguarde a verificação", {
                  description:
                    "💡 A sua conta precisa ser verificada
                      para poder execer qualquer acção na plataforma , consulte a equipe de
                      atendimento pelo whatsapp +244 957 777 993",
                });
                e.preventDefault();
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
