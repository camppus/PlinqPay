"use client";

import CodeBlock from "@/components/Code";
import { Webhook } from "lucide-react";

export default function CallBackPage() {
  return (
    <section className="space-y-6">
      {/* Introdução */}
      <div>
        <strong className="text-blue-500">Introdução</strong>
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight">
          Callback API
        </h1>
        <p className="leading-7 dark:text-neutral-400">
          O callback permite que sua aplicação seja notificada automaticamente
          sempre que houver uma mudança no status de uma transação. Você não
          precisa consultar a API constantemente.
        </p>
      </div>

      {/* Chave de API */}
      <div className="flex items-center gap-4 border p-4 rounded-lg bg-blue-500/10 border-blue-500/30">
        <Webhook />
        <span>
          <strong className="text-blue-500">Chave de API: </strong>
          <span>
            Sua credencial de acesso à API da Plinqpay. Esta chave identifica
            sua conta e autoriza suas requisições.
          </span>
          <strong className="text-blue-500"> IMPORTANTE: </strong>
          <span>Sem a chave de API, as requisições serão recusadas.</span>
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Estrutura do JSON enviado</h2>
        <p className="text-sm dark:text-neutral-400">
          A API enviará um POST para o seu <code>callbackUrl</code> sempre que
          houver mudança de status na transação:
        </p>

        <CodeBlock
          language="typescript"
          code={` {
  id: 'trx_8f3c2d1a',
  companieId: 'comp_123456',
  externId: 'ORDER_2026_0001',
  getawayIdentifier: 'PLIQPAG',
  status: PaymentStatus.PENDING,
  amount: 15000,        // valor bruto
  subtotal: 14000,      // soma dos itens
  tax: 1000,            // imposto
  total: 15000,         // subtotal + tax
  taxType: TaxType.FIXED,
  method: PaymentMethod.REFERENCE,
  currency: 'AOA',
  signature: 'b7f9a2c4e9f1d0a8c3b2e4f6a1d9e0ffab1234567890',
  entity: '12345',
  reference: '987654321',
  callbackUrl: 'https://api.meusite.com/payments/callback',
  paidAt: null,
  failureReason: null,
  createdAt: new Date('2026-01-23T10:15:00Z'),
  updatedAt: new Date('2026-01-23T10:15:00Z'),
  client: {
    id: 'client_001',
    transactionId: 'trx_8f3c2d1a',
    name: 'Francisco Diakomas',
    email: 'francisco@email.com',
    phone: '+244923456789',
    createdAt: new Date('2026-01-23T10:15:00Z'),
    updatedAt: new Date('2026-01-23T10:15:00Z'),
  },
  items: [
    {
      id: 'item_001',
      transactionId: 'trx_8f3c2d1a',
      title: 'Curso de NestJS Avançado',
      price: 10000,
      quantity: 1,
      createdAt: new Date('2026-01-23T10:15:00Z'),
      updatedAt: new Date('2026-01-23T10:15:00Z'),
    },
    {
      id: 'item_002',
      transactionId: 'trx_8f3c2d1a',
      title: 'E-book Clean Architecture',
      price: 4000,
      quantity: 1,
      createdAt: new Date('2026-01-23T10:15:00Z'),
      updatedAt: new Date('2026-01-23T10:15:00Z'),
    },
  ],
};
`}
        />
      </div>

      {/* Explicação da assinatura HMAC */}
      <div className="space-y-2 border p-4 rounded-lg bg-blue-500/10 border-blue-500/20">
        <h2 className="text-lg font-semibold text-blue-500 dark:text-blue-400">
          Assinatura HMAC
        </h2>
        <p className="text-sm dark:text-neutral-400">
          Cada callback contém uma <strong>assinatura HMAC</strong> no campo
          <code>signature</code>. Ela garante que os dados são legítimos. Para
          validar:
        </p>
        <ol className="list-decimal list-inside text-sm dark:text-neutral-400 space-y-1">
          <li>Receba o JSON no seu backend.</li>
          <li>
            Gere o HMAC usando os mesmos campos da transação e sua chave
            secreta.
          </li>
          <li>Compare a assinatura recebida com a gerada.</li>
          <li>Se bater, atualize a transação no seu banco.</li>
          <li>Se não bater, rejeite o callback.</li>
        </ol>
      </div>

      {/* Status possíveis */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Status possíveis</h2>
        <ul className="list-disc list-inside text-sm dark:text-neutral-400 space-y-1">
          <li>
            <strong>PENDING:</strong> Transação criada, aguardando pagamento.
          </li>
          <li>
            <strong>SUCCESS:</strong> Pagamento aprovado, transação concluída.
          </li>
          <li>
            <strong>FAILED:</strong> Pagamento falhou, transação não concluída.
          </li>
          <li>
            <strong>CANCELLED:</strong> Transação cancelada pelo cliente ou
            sistema.
          </li>
        </ul>
      </div>

      {/* Exemplo de validação HMAC */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Exemplo de validação HMAC (Node.js)
        </h2>
        <CodeBlock
          code={`async verifySignature(
  payload: Transaction,
  secretKey: string,
): boolean {
  const { sign } = payload;

  const payloadToVerify = {
    externalId: payload.externalId,
    amount: payload.amount,
    method: payload.method,
    callbackUrl: payload.callbackUrl,
  };

  const canonical = JSON.stringify(payloadToVerify); // mesma forma usada na assinatura
  const expectedSign = crypto
    .createHmac('sha256', secretKey)
    .update(canonical, 'utf8')
    .digest('base64');

  // timingSafeEqual evita ataques de timing
  return crypto.timingSafeEqual(Buffer.from(expectedSign), Buffer.from(sign));
}`}
          language="typescript"
        />
      </div>
    </section>
  );
}
