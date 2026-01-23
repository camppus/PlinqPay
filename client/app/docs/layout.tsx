"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Moon,
  Sun,
  PartyPopperIcon,
  Hand,
  Webhook,
  Lock,
  PiggyBank,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DocLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("Comece aqui");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  interface ILink {
    title: string;
    icon: ReactNode;
    to: string;
    sub: (Omit<ILink, "sub"> & { method?: string })[];
  }

  const links: ILink[] = [
    {
      title: "Comece aqui",
      icon: <Hand className="animate-pulse" size={17} />,
      to: "/docs/",
      sub: [],
    },
    {
      title: "Autenticação",
      icon: <Lock size={17} />,
      to: "/docs/auth",
      sub: [],
    },
    {
      title: "Callback URL",
      icon: <Webhook size={17} />,
      to: "/docs/calback",
      sub: [],
    },
    {
      title: "Pagamento",
      icon: <PiggyBank size={17} />,
      to: "/docs/payments",
      sub: [
        {
          title: "Criar pagamento",
          icon: <PartyPopperIcon size={17} />,
          to: "/docs/payments",
          method: "POST",
        },
      ],
    },
    {
      title: "Taxas",
      icon: <TrendingUp size={17} />,
      to: "/docs/tax",
      sub: [
        {
          title: "Taxa actual",
          icon: <PartyPopperIcon size={17} />,
          to: "/docs/tax",
          method: "GET",
        },
      ],
    },
  ];

  const renderLinks = () =>
    links.map((link) => {
      const isActive =
        active === link.title || link.sub.some((sub) => sub.to === active);
      return (
        <div key={link.title} className="mb-2">
          <Link href={link.to} onClick={() => setActive(link.title)}>
            <span
              className={clsx(
                "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-neutral-500/10",
                isActive &&
                  "bg-blue-500/10 text-blue-500 border-blue-500/20 border font-semibold",
              )}
            >
              {link.icon}
              <p className="text-sm">{link.title}</p>
            </span>
          </Link>
          {link.sub?.length > 0 && (
            <div className="flex flex-col space-y-2 mt-2 pl-4">
              {link.sub.map((sub) => (
                <Link
                  key={sub.title}
                  href={sub.to}
                  className="flex items-center gap-2 p-1 rounded cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Badge
                    variant="outline"
                    className={clsx("rounded-sm", {
                      "text-green-500 bg-green-500/10 border-green-500/30":
                        sub.method === "POST",
                      "text-blue-500 bg-blue-500/10 border-blue-500/30":
                        sub.method === "GET",
                    })}
                  >
                    {sub.method}
                  </Badge>
                  {sub.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    });

  return (
    <main className="flex flex-col w-full ">
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-16 bg-transparent backdrop-blur-lg border-b border-dashed lg:px-50 px-4 ">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className={clsx("h-10 w-28 object-contain", {
              "brightness-0 grayscale-100": theme === "light",
            })}
          />
        </div>

        {/* Desktop buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Button className="text-white font-mono">Dashboard</Button>
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

        {/* Mobile burger */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </header>

      <div className="flex lg:px-50 px-4">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex mt-3 w-64 border-r border-dashed flex-col h-screen fixed top-0 pr-2 pt-16 overflow-auto">
          {renderLinks()}
        </aside>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={clsx(
            "fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-900 transform transition-transform lg:hidden overflow-auto flex flex-col pt-16",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="p-4 flex flex-col gap-2 flex-1">
            {renderLinks()}
            <div className="mt-auto flex flex-col gap-2">
              <Button
                className="w-full text-white"
                onClick={() => setSidebarOpen(false)}
              >
                Painel
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "Claro" : "Escuro"}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 lg:ml-64 overflow-auto flex flex-col">
          <section className="lg:px-10 py-4 pb-10">{children}</section>
        </div>
      </div>
    </main>
  );
}
