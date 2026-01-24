"use client";

import CodeBlock from "@/components/Code";
import clsx from "clsx";
import { useTheme } from "next-themes";

export default function DocLayout() {
  const { theme } = useTheme();
  return (
    <main className="min-h-screen flex flex-col gap-3">
      <strong className="text-blue-500 ">Introdução</strong>
      <h1 c>
        Comece aqui!
      </h1>
      <p>Pegue seu café e aprenda sobre a PlinqPay!</p>
      <p className="leading-7 dark:text-neutral-400">
        Nesta documentação você encontrará tudo o que precisa para integrar com
        a API da PlinqPay. Desenvolvida por desenvolvedores para
        desenvolvedores, nossa plataforma foi projetada para ser intuitiva e
        fácil de usar.
      </p>

      <span className="flex items-center mt-5  scroll-m-20  text-2xl font-extrabold tracking-tight text-balanc gap-2">
        <img
          src="/logo.png"
          alt=""
          className={clsx("h-10 w-28 object-contain", {
            "brightness-0 grayscale-100": theme === "light",
          })}
        />{" "}
      </span>

      <p className="dark:text-neutral-400">
        A PlinqPay é um gateway de pagamento que surgiu da nossa própria
        necessidade de simplificar cobranças em nossos produtos. Percebemos que
        os meios de pagamento existentes eram excessivamente complexos:
      </p>

      <ul className="dark:text-neutral-400 list-disc list-inside flex flex-col gap-2  pl-3">
        <li>Documentações extensas e confusas</li>
        <li>Processos de homologação longos e burocráticos</li>
        <li>Múltiplas formas de realizar a mesma operação</li>
        <li>Alguns gateways até exigem cursos para integração!</li>
      </ul>

      <p>
        Nossa solução? Uma plataforma que transforma a complexidade das Fintechs
        em uma API simples e intuitiva. Veja como é fácil:
      </p>
      <CodeBlock
        language="typescript"
        code={`
const response = await fetch('https://pliqpag-api.onrender.com/v1/transaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-key': 'SUA CHAVE DE API'
  },
  body: JSON.stringify({
    externalId: 'trx_123456',
    callbackUrl: 'https://meusite.com/webhook',
    method: 'REFERENCE',
    client: {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '+244923000000'
    },
    items: [
      {
        title: 'Curso de NestJS',
        price: 5000,
        quantity: 2
      }
    ],
    amount: 1
  })
});
  `}
      />
    </main>
  );
}
