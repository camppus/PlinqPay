"use client";

import React, { useEffect, useState } from "react";

export const InfiniteImageScroller = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      // duplicar conteúdo para scroll infinito
      const content = Array.from(scrollerRef.current.children);
      content.forEach((item) => {
        scrollerRef.current?.appendChild(item.cloneNode(true));
      });

      // direção
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse",
      );

      // velocidade
      const duration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);

      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden  ${className}`}
    >
      <div
        ref={scrollerRef}
        className={`flex gap-8 whitespace-nowrap  ${start ? "animate-scroll" : ""} ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
      >
        {items.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Empresa"
            className="h-10 object-contain grayscale opacity-50"
          />
        ))}
      </div>
    </div>
  );
};
