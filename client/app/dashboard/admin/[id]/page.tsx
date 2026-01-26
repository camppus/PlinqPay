"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { transactionsMock } from "@/constants/mocks/transacctionmock";
import { ITransaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { isArrayMappble } from "@/lib/utils";
import { statusMap } from "@/components/Transactions";

export default function TransactionDetailsPage() {
  const { id } = useParams(); // pegar id da rota
  const [transaction, setTransaction] = useState<ITransaction | null>(null);

  useEffect(() => {
    const trx = transactionsMock.find((t) => t.id === id);
    setTransaction(trx || null);
  }, [id]);

  if (!transaction) {
    return (
      <p className="p-5 text-center text-red-500">Transação não encontrada</p>
    );
  }

  const status = statusMap[transaction.status];

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalhes</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          {status.icon} <span>{status.title}</span>
        </Badge>
      </div>

      {/* Cliente */}
      <div className="flex items-center gap-4 border rounded-xl p-4 bg-background shadow-sm">
        <Avatar>
          <AvatarFallback className="font-black uppercase">
            {transaction.client?.name[0]}
            {transaction.client?.name[transaction.client?.name.length - 1]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{transaction.client?.name}</p>
          <p className="text-sm text-muted-foreground">
            {transaction.client?.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {transaction.client?.phone}
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-background shadow-sm">
          <p className="text-xs text-muted-foreground">Subtotal</p>
          <p className="text-lg font-semibold">
            {transaction.subtotal.toLocaleString("pt")},00 kz
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-background shadow-sm">
          <p className="text-xs text-muted-foreground">Taxa</p>
          <p className="text-lg font-semibold">
            {transaction.tax.toLocaleString("pt")},00 kz
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-background shadow-sm col-span-2">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold">
            {transaction.total.toLocaleString("pt")},00 kz
          </p>
        </div>
      </div>

      {/* Itens */}
      <div className="border rounded-xl bg-background shadow-sm p-4">
        <h2 className="font-semibold mb-2">Itens</h2>
        <ul className="divide-y divide-muted-foreground">
          <li className="py-2 flex justify-between">
            <span>Produto</span>
            <span>Quantidade</span>
            <span>Preço</span>
          </li>
          {isArrayMappble(transaction.items) &&
            transaction.items.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>{item.title.slice(0, 10)}..</span>
                <span>{item.quantity}</span>
                <span>
                  {(item.price * item.quantity).toLocaleString("pt")},00 kz
                </span>
              </li>
            ))}
        </ul>
      </div>

      {/* Datas e referência */}
      <div className="border rounded-xl bg-background shadow-sm p-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Criada em</p>
          <p>{transaction.createdAt.toLocaleDateString("pt")}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Atualizada em</p>
          <p>{transaction.updatedAt.toLocaleDateString("pt")}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Referencia</p>
          <p>{transaction.reference}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Entidade</p>
          <p className="truncate">{transaction.entity}</p>
        </div>
      </div>
    </div>
  );
}
