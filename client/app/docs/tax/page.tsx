"use client";

import CodeBlock from "@/components/Code";

const codeExample = `const res =  fetch('https://pliqpag-api.onrender.com/v1/tax', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`;

export default function GetTaxDoc() {
  return (
    <section className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-blue-500">Taxas</span>

        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
          Consultar taxas
        </h1>

        <p className="leading-7 text-neutral-600 dark:text-neutral-400">
          Consulte as taxas aplicadas nas transações antes de criar um
          pagamento. Isso ajuda a calcular valores finais, impostos e custos
          operacionais.
        </p>
      </div>

      {/* Endpoint */}
      <div className="rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <span className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
            GET
          </span>
          <code className="text-sm">/v1/tax</code>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">O que esse endpoint retorna</h2>

        <p className="text-neutral-700 dark:text-neutral-300">
          Esse endpoint retorna as taxas configuradas no sistema, que podem ser
          utilizadas para:
        </p>

        <ul className="list-disc pl-6 space-y-1 text-neutral-700 dark:text-neutral-300">
          <li>Cálculo de impostos</li>
          <li>Taxas fixas ou percentuais</li>
          <li>Simulação de valores finais</li>
        </ul>
      </div>

      {/* Code */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Exemplo de requisição</h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Basta fazer uma requisição <strong>GET</strong> para consultar as
          taxas disponíveis.
        </p>

        <CodeBlock code={codeExample} language="javascript" />
      </div>

      {/* Response Example */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Exemplo de resposta</h2>

        <CodeBlock
          language="json"
          code={`{
  "taxType": "PERCENT",
  "value": 2.5,
  "currency": "AOA"
}`}
        />
      </div>

      {/* Notes */}
      <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950">
        <p className="text-sm text-yellow-900 dark:text-yellow-200">
          ⚠️ <strong>Atenção:</strong> As taxas podem ser alteradas a qualquer
          momento. Sempre consulte este endpoint antes de calcular um pagamento.
        </p>
      </div>
    </section>
  );
}
