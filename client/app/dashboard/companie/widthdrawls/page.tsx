"use client";

import { JSX, useState } from "react";
import { withdrawalsMock } from "@/constants/mocks/widhtdrals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { FaCheckCircle, FaClock, FaTimesCircle, FaEye } from "react-icons/fa";
import clsx from "clsx";
import { statusMap } from "@/components/Transactions";
import { useUser } from "@/context/UserContext";
import Stats from "@/components/Stats";
import { Wallet } from "@/components/Wallet";
import { IconDownload } from "@tabler/icons-react";

export default function WithdrawalsPage() {
  const [openSheet, setOpenSheet] = useState(false);
  const [amount, setAmount] = useState(0);
  const [comprovanteUrl, setComprovanteUrl] = useState<string | null>(null);
  const { user } = useUser();
  // Saldo
  const totalWithdrawn = withdrawalsMock
    .filter((w) => w.status === PaymentStatus.PAID)
    .reduce((acc, cur) => acc + Number(cur.amount), 0);

  const walletBalance = 20000;
  const availableToWithdraw = walletBalance - totalWithdrawn;

  const handleWithdraw = () => {
    if (amount > availableToWithdraw) return alert("Saldo insuficiente");
    alert(`Solicitação de saque de ${formatCurrency(amount)} enviada!`);
    setOpenSheet(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      {user?.wallet ? (
        <Wallet
          bankName={user.wallet.bank}
          iban={user.wallet.iban}
          userName={user.wallet.walletHolder}
        />
      ) : (
        <Wallet
          bankName={"Registre seu cartão"}
          iban={"0000000000000000000"}
          userName={"Não cadastrado"}
        />
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <Stats
          data={{
            title: "Saldo Disponível",
            subtitle: "Atual",
            description: "Total disponível na conta do usuário",
            amount: user.totalDisponible,
            isCoin: true,
          }}
        />

        <Stats
          data={{
            title: "Total Faturado",
            subtitle: "Acumulado",
            description: "Valor total faturado pelo usuário",
            amount: user.totalErned,
            isCoin: true,
          }}
        />
      </div>

      <Button
        disabled={user.totalDisponible == 0}
        className=" text-white"
        onClick={() => setOpenSheet(true)}
      >
        Sacar
      </Button>

      <div className="border rounded-xl bg-background shadow-sm p-4 w-full">
        <h2 className="font-semibold mb-2">Histórico de Saques</h2>
        <ul className="divide-y divide-muted-foreground">
          {withdrawalsMock.map((w) => {
            const status = statusMap[w.status];
            return (
              <li key={w.id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{formatCurrency(w.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.createdAt.toLocaleDateString("pt")}
                  </p>
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
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>
                    {status.icon}{" "}
                    {w.status == PaymentStatus.PAID
                      ? "Aprovado"
                      : w.status == PaymentStatus.PENDING
                        ? "Pendente"
                        : "Rejeitado"}
                  </Badge>

                  {/* Ver comprovante */}
                  {w.fileUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setComprovanteUrl(w.fileUrl!)}
                      className="flex items-center gap-1"
                    >
                      <FaEye /> Ver
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Sacar fundos</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-4">
            <p>Saldo disponível: {formatCurrency(availableToWithdraw)}</p>
            <Input
              type="number"
              placeholder="Valor a sacar"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <Button onClick={handleWithdraw} className="w-full">
              Solicitar saque
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={!!comprovanteUrl}
        onOpenChange={() => setComprovanteUrl(null)}
      >
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Comprovante</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {comprovanteUrl ? (
              <iframe
                src={comprovanteUrl}
                className="w-full h-96 rounded-md border"
              />
            ) : (
              <p>Sem comprovante disponível</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
