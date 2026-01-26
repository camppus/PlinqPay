"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-6">
        {/* Imagem */}
        <div className="flex justify-center">
          <Image
            src="/404.svg"
            alt="Página não encontrada"
            width={260}
            height={260}
            priority
          />
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Página não encontrada</h1>
          <p className="text-muted-foreground">
            Opa! A página que você tentou acessar não existe ou foi movida.
          </p>
        </div>

        {/* Ações */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Ir para início
          </Button>
        </div>
      </div>
    </div>
  );
}
