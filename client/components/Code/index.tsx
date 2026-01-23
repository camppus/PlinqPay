"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "../ui/button";

export default function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reseta mensagem de copiado
  };

  return (
    <div className="relative">
      <Button
        onClick={handleCopy}
        className="absolute right-2 z-3 top-4 text-sm px-2 py-1 rounded text-white"
      >
        {copied ? "Copiado!" : "Copiar"}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? materialDark : materialLight}
        showLineNumbers
        wrapLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
