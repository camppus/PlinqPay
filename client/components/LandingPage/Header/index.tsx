"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react"; // ícones do hamburger

export function Header() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed bg-transparent backdrop-blur-3xl z-50 top-0 w-full flex items-center justify-between  py-">
      <Striped alt={null} />

      <div className="flex items-center justify-between w-full lg:px-12 px-4">
        {/* Logo */}
        <div>
          <img
            src="/logo.png"
            alt="Logo"
            className={clsx("h-15 w-30 object-contain", {
              "brightness-100 grayscale-100": theme === "light",
            })}
          />
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <a href="" className="hover:text-blue-500 transition-all">
            Integrações
          </a>
          <a href="" className="hover:text-blue-500 transition-all">
            Taxas
          </a>
          <a href="" className="hover:text-blue-500 transition-all">
            Documentação
          </a>
          <a href="" className="hover:text-blue-500 transition-all">
            Suporte
          </a>
          <Button size="sm" className="text-white">
            Cadastre-se
          </Button>
        </nav>

        {/* Hamburger mobile */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col md:hidden p-4 gap-3">
          <a href="" className="hover:text-blue-500 transition-all">
            Integrações
          </a>
          <a href="" className="hover:text-blue-500 transition-all">
            Taxas
          </a>
          <a href="" className="hover:text-blue-500 transition-all">
            Documentação
          </a>
          <a href="" className="hover:text-blue-500 transition-all">
            Suporte
          </a>
          <Button size="sm" className="text-white w-full">
            Cadastre-se
          </Button>
        </div>
      )}

      <Striped alt={null} />
    </header>
  );
}

export function Striped({ alt = null }: { alt: string | null }) {
  return (
    <span
      className={clsx(
        "bg-[repeating-linear-gradient(45deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:25px_25px] bg-fixed [--pattern-fg:#e1e1e1] opacity-5 lg:w-50 h-20 lg:flex hidden ",
        {
          "h-40": alt,
        },
      )}
    />
  );
}
