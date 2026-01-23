"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  Lightbulb,
  Lock,
  Siren,
  TriangleAlert,
} from "lucide-react";

export default function AuthDoc() {
  return (
    <section className="min-h-screen flex flex-col gap-3">
      <strong className="text-blue-500 ">Introdução</strong>
      <h1 className="scroll-m-20  text-2xl font-extrabold tracking-tight text-balance">
        Autenticação!
      </h1>
      <p className="leading-7 dark:text-neutral-400">
        Como enviar requisições para a nossa APIe fácil de usar.
      </p>

      <div className="flex items-center gap-4 border p-4  rounded-lg bg-blue-500/10 border-blue-500/30">
        <Lightbulb />
        <span>
          <strong className="text-blue-500">Chave de API: </strong>{" "}
          <span>
            Sua credencial de acesso à API da PlinqPag. Esta chave identifica
            sua conta e autoriza suas requisições.
          </span>
          <strong className="text-blue-500"> IMPORTANTE: </strong>
          <span>Sem a chave de API, as requisições serão recusadas.</span>
        </span>
      </div>

      <span className="flex items-center mt-5  scroll-m-20  text-2xl font-extrabold tracking-tight text-balanc gap-2">
        <Lock />
        <h1 className="scroll-m-20  text-2xl font-extrabold tracking-tight text-balance">
          Gerenciando chaves de API
        </h1>
      </span>
      <p>
        Gerencie suas chaves de API diretamente em nossa plataforma. Você pode:
      </p>
      <ul className="dark:text-neutral-400 list-disc list-inside flex flex-col gap-2 pl-3">
        <li>Listar todas as chaves ativas</li>
        <li>Criar novas chaves</li>
        <li>Revogar chaves existentes</li>
      </ul>
      <Button className="text-white md:w-[20%] w-full mt-3">
        <Lock />
        Minhas chaves
      </Button>

      <span className="flex lg:flex-row flex-col lg:items-center gap-4 border p-4  rounded-lg bg-blue-500/10 border-blue-500/30 mt-10">
        <span>
          <Siren />
        </span>
        <span className="flex flex-col gap-2">
          <strong className="scroll-m-20  text-xl text-blue-500 font-extrabold tracking-tight text-balance">
            Boas Práticas de Segurança
          </strong>
          <ul className="dark:text-neutral-400 list-disc list-inside flex flex-col gap-2">
            <li>
              Armazene suas chaves em variáveis de ambiente ou gerenciadores de
              segredos
            </li>
            <li>Nunca compartilhe suas chaves de API</li>
            <li>A PlinqPag nunca solicitará suas chaves</li>
            <li>Revogar chaves existentes</li>
            <li>Revogue imediatamente qualquer chave comprometida</li>
          </ul>
        </span>
      </span>

      <span className="flex lg:flex-row flex-col lg:items-center gap-4 border p-4  rounded-lg bg-blue-500/10 border-blue-500/30 mt-10">
        <span>
          <TriangleAlert />
        </span>
        <span className="flex flex-col gap-2">
          <strong className="scroll-m-20  text-xl text-blue-500 font-extrabold tracking-tight text-balance">
            Erro de Autenticação
          </strong>
          <p>
            A API retornará o código HTTP{" "}
            <Badge className="text-white mx-1">401</Badge> quando:
          </p>
          <ul className="dark:text-neutral-400 list-disc list-inside flex flex-col gap-2">
            <li>A chave de API não for fornecida no header</li>
            <li>A chave for inválida</li>
            <li>A PlinqPag nunca solicitará suas chaves</li>
            <li>A chave tiver sido revogada</li>
          </ul>
        </span>
      </span>
    </section>
  );
}
