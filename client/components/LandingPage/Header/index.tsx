"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react"; // ícones do hamburger

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed bg-transparent backdrop-blur-3xl z-50 top-0 w-full flex items-center justify-between lg:py-0 py-4">
      <Striped alt={null} />

      <div className="flex items-center justify-between w-full lg:px-12 px-4">
        {/* Logo */}
        <div>
          <img
            src="/logo.png"
            alt="Logo"
            className={clsx("h-10 w-28 object-contain", {
              "brightness-0 grayscale-100": theme === "light",
            })}
          />
        </div>

        {/* Menu desktop */}
        <nav className="flex items-center gap-4 text-sm">
          <a
            href="/docs"
            className="hover:text-blue-500 lg:flex hidden  transition-all"
          >
            Documentação
          </a>
          <a href="/auth">
            <Button size="sm" className="text-white">
              Cadastre-se
            </Button>
          </a>
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
        </nav>
      </div>

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
          "lg:w-65": !alt,
        },
      )}
    />
  );
}
