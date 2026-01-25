"use client";

import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme } = useTheme();

  const [mounted, setmOunthed] = useState(false);
  useEffect(() => {
    setmOunthed(true);
  }, []);

  if (!mounted) return null;

  return (
    <img
      src="/logo.png"
      alt="Logo"
      className={clsx("h-13 w-30 object-contain", {
        "brightness-0 grayscale-100": theme === "light",
      })}
    />
  );
}
