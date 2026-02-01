"use client";

import CodeBlock from "@/components/Code";

export default function Payemtent() {
  const codeExample = `fetch('https://pliqpag-api.onrender.com/v1/transaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
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
        quantity: 1
      }
    ],
    amount: 5000
  })
});`;
  return (
    <section className="space-y-6">
      <div>
        <strong className="text-blue-500">Introdução</strong>
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight">
          Pagamentos
        </h1>
        <p className="leading-7 dark:text-neutral-400">
          Crie uma transação de pagamento e receba atualizações automáticas via
          webhook sempre que o status mudar.
        </p>
      </div>

      <div className="rounded-lg border p-4 ">
        <div className="flex items-center gap-3">
          <span className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white">
            POST
          </span>
          <code className="text-sm">https://pliqpag-api.onrender.com/v1/transaction</code>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Como funciona</h2>

        <ol className="list-decimal space-y-2 pl-6 text-neutral-700 dark:text-neutral-300">
          <li>Você cria uma transação informando os dados do cliente</li>
          <li>O sistema gera uma referência de pagamento</li>
          <li>O cliente realiza o pagamento</li>
          <li>Sua aplicação recebe o status via callbackURL POST</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold">Exemplo de requisição</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Utilize o exemplo abaixo para criar um pagamento por referência.
        </p>
        <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            💡 <strong>NOTA :</strong> O campo <code>externalId</code> deve ser
            único no seu sistema para evitar pagamentos duplicados e para que o
            seu sistema saiba qual é o pagamento que precisa ser modificado
          </p>
        </div>{" "}
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950">
          <p className="text-sm text-red-900 dark:text-red-200">
            💡 <strong>NOTA :</strong> O campo <code>callbackUrl</code> deve ser o endpoint do teu backend do tipo POST onde serão enviados os dados do pagamento sempre que houver uma mudança nele como Confirmação , Cancelamento etc.
          </p>
        </div>
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
    externalId: 'ID do pagamento no teu sistema (Único) ',
    callbackUrl: 'https://meusite.com/webhook' //Deve ser o endpoint do teu backend do tipo POST,
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
      </div>
    </section>
  );
}
