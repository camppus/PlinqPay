"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { IWithdrawal, PaymentStatus } from "@/types";
import { formatCurrency, isArrayMappble } from "@/lib/utils";
import { statusMap } from "@/components/Transactions";
import { useUser } from "@/context/UserContext";
import Stats from "@/components/Stats";
import { IconDownload } from "@tabler/icons-react";
import constants from "@/constants";
import WithdrawlsSevice from "@/services/Widthdralls";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowLeft, ArrowRight, FolderRoot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/Loader";

export default function WithdrawalsPage() {
  const [tax, setTax] = useState({
    taxType: "PERCENT",
    taxa: "7%",
    currency: "AOA",
    value: 0.07,
  });
  const [openSheet, setOpenSheet] = useState(false);
  const [amount, setAmount] = useState(0);
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPAge] = useState(1);
  const [load, setLoad] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [Widthdralls, setWithdrawl] = useState<IWithdrawal[]>([]);

  if (!user) {
    return null;
  }

  const handleWithdraw = async () => {
    setProcessing(true);
    const token = localStorage.getItem("token") as string;
    const data = await new WithdrawlsSevice(token).create(amount);
    console.log(data);
    setProcessing(false);
    const message = isArrayMappble(data?.message)
      ? data?.message[0]
      : data?.message;
    toast.info(message);
    console.log(data);
  };

  useEffect(() => {
    async function get() {
      const token = localStorage.getItem("token") as string;
      const [data, taxRequest] = await Promise.all([
        new WithdrawlsSevice(token).getAlls(page),
        new WithdrawlsSevice(token).getTax(),
      ]);
      setTax(taxRequest);
      if (data?.pagination) {
        setLastPAge(data?.pagination?.lastPage);
      }
      setWithdrawl(data?.data);
      setTimeout(() => {
        setLoad(false);
      }, constants.TIMEOUT_LOADER);
    }

    get();
  }, [page]);

  if (load) {
    return (
      <section className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
        <Loader />
      </section>
    );
  }
  return (
    <div className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      <div className="grid md:grid-cols-2 gap-4">
        <Stats
          data={{
            title: "Saldo Disponível",
            subtitle: "Atual",
            description: "Total disponível na minha conta",
            amount: user.totalDisponible,
            isCoin: true,
          }}
        />

        <Stats
          data={{
            title: "Total Faturado",
            subtitle: "Acumulado",
            description: "Valor total faturado por mim na plinkpay",
            amount: user.totalErned,
            isCoin: true,
          }}
        />
      </div>
      <span className="w-full my-2">
        <Stats
          data={{
            title: "Taxa Actual",
            subtitle: `A taxa actual é de ${tax.taxa}`,
            description: "Esta é uma taxa simbólica para a plikpay",
            amount: Number(Math.round(tax.value * 100) ?? 0),
            isCoin: false,
          }}
        />
      </span>
      <Button
        disabled={user.totalDisponible <= 0}
        className=" text-white"
        onClick={() => setOpenSheet(true)}
      >
        Solicitar saque
      </Button>

      {!isArrayMappble(Widthdralls) ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderRoot />
            </EmptyMedia>
            <EmptyTitle>Sem saques</EmptyTitle>
            <EmptyDescription>
              Assim que os saques começarem a surgir apareceram aqui.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="border rounded-xl bg-background shadow-sm p-4 w-full">
          <h2 className="font-semibold mb-2">Histórico de Saques</h2>
          <ul className="divide-y divide-muted-foreground">
            {Widthdralls.map((w) => {
              const status = statusMap[w.status];
              return (
                <li
                  key={w.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{formatCurrency(w.amount)}</p>
                    <span className="flex flex-col gap-2">
                      <small className="text-xs text-muted-foreground">
                        {new Date(w.createdAt).toLocaleDateString("smallt")}
                      </small>

                      {w.approvedAt && (
                        <small className="text-xs text-muted-foreground">
                          Aprovado aos{" "}
                          {new Date(w.approvedAt).toLocaleDateString("pt")}
                        </small>
                      )}
                      {w.revokedAt && (
                        <small className="text-xs text-muted-foreground">
                          Rejeitado aos{" "}
                          {new Date(w.revokedAt).toLocaleDateString("pt")}
                        </small>
                      )}
                    </span>
                  </div>
                  {w.status == PaymentStatus.PAID && (
                    <div className="flex flex-col gap-2">
                      <p className="font-medium">Comprovativo</p>
                      <a target="_blank" download href={w.fileUrl ?? ""}>
                        <Badge variant={"outline"}>
                          <IconDownload />
                          Baixar
                        </Badge>
                      </a>
                    </div>
                  )}
                  {w.notes && (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm">{w.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant={"outline"}>
                      {status.icon}{" "}
                      {w.status == PaymentStatus.PAID
                        ? "Aprovado"
                        : w.status == PaymentStatus.PENDING
                          ? "Pendente"
                          : "Rejeitado"}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ul>
          <span className="flex gap-3 mt-2 justify-center">
            <Button
              disabled={page <= 1 || load}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              variant="outline"
              className="rounded-full"
              size="icon"
            >
              <ArrowLeft />
            </Button>
            <span className="flex items-center px-2">
              {page} / {lastPage}
            </span>
            <Button
              disabled={page >= lastPage || load}
              onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
              variant="outline"
              className="rounded-full"
              size="icon"
            >
              <ArrowRight />
            </Button>
          </span>
        </div>
      )}

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Sacar fundos</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-4 px-2">
            <p>
              Saldo disponível:{" "}
              {Number(user.totalDisponible).toLocaleString("pt")}, 00 kz
            </p>
            <p>Saque Mínimo: {Number(5000).toLocaleString("pt")}, 00 kz</p>
            <Input
              type="number"
              placeholder="Valor a sacar"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <Button
              disabled={processing}
              onClick={handleWithdraw}
              className="w-full text-white"
            >
              {processing ? (
                <Loader2 className="animate-spin" />
              ) : (
                " Solicitar saque"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
