"use client";
import { RecentTransaction } from "@/components/Transactions";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Wallet } from "@/components/Wallet";
import { transactionsMock } from "@/constants/mocks/transacctionmock";
import { isArrayMappble } from "@/lib/utils";
import { ITransaction } from "@/types";
import { ArrowLeft, ArrowRight, FolderRoot } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [recentTrasactions, setRecentTransactions] = useState<ITransaction[]>([
    ...transactionsMock,
  ]);

  return (
    <article className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950">
        <p className="text-sm text-red-900 dark:text-red-200">
          💡 <strong>IMPORTANTE :</strong> O seu <code>perfil</code> precisa
          verificado para poder execer qualquer acção.
        </p>
        <Button className="mt-4 " size={"sm"} variant={"outline"}>
          Verificar
        </Button>
      </div>
      <Wallet
        bankName="BAI"
        iban="12345678903LASPO"
        userName="Francisco Diakomas"
      />

      <span>
        <div></div>
        <div></div>
      </span>

      <span className="mt-4">
        {!isArrayMappble(recentTrasactions) ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderRoot />
              </EmptyMedia>
              <EmptyTitle>Sem tranações</EmptyTitle>
              <EmptyDescription>
                Assim que os pagamentos começarem a surgir apareceram aqui os 5
                mais recentes pagamento
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <span className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="opacity-80">Trasanções</h1>
              <p className="text-xs opacity-80">1 de 100</p>
            </div>

            <span className="flex flex-col gap-3">
              {recentTrasactions.map((item, idx) => (
                <RecentTransaction data={item} key={idx} />
              ))}
              <span className="flex gap-3 mt-2 justify-center">
                <Button
                  variant={"outline"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  variant={"outline"}
                  className="rounded-full"
                  size={"icon"}
                >
                  <ArrowRight />
                </Button>
              </span>
            </span>
          </span>
        )}
      </span>
    </article>
  );
}
