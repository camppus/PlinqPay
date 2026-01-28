"use client";
import { RecentTransaction } from "@/components/Transactions";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Wallet } from "@/components/Wallet";
import { transactionsMock } from "@/constants/mocks/transacctionmock";
import { useUser } from "@/context/UserContext";
import { isArrayMappble } from "@/lib/utils";
import { ITransaction } from "@/types";
import { ArrowLeft, ArrowRight, FolderRoot, Hand, Loader2 } from "lucide-react";
import { useEffect, useId, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { IconCoin, IconUser } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";
import constants from "@/constants";
import TenantService from "@/services/tenant";

import TransactionSevice from "@/services/Transaction";
export default function Home() {
  const { user, setUser } = useUser();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPAge] = useState(1);
  const [iban, setIban] = useState("");
  const [bank, setBank] = useState("");
  const [bankHolder, setBankHoder] = useState("");
  const [load, setLoad] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [recentTrasactions, setRecentTransactions] = useState<ITransaction[]>(
    [],
  );

  if (!user) {
    return;
  }
  const handleSubmit = async () => {
    if (!iban || !bank || !bankHolder)
      return toast.info("Preencha todos os campos");
    const token = localStorage.getItem("token") as string;
    setProcessing(true);
    const res = await new TenantService(token).createWallet({
      bank,
      iban,
      walletHolder: bankHolder,
    });
    toast.info(res?.message ?? "Cateira registrada");
    setProcessing(false);
    if (res?.id) {
      setUser({
        ...user,
        wallet: res,
      });
    }
  };

  const update = async () => {
    if (!iban || !bank || !bankHolder)
      return toast.info("Preencha todos os campos");
    const token = localStorage.getItem("token") as string;
    setProcessing(true);
    const res = await new TenantService(token).updateWallet({
      bank,
      iban,
      walletHolder: bankHolder,
    });
    toast.info(res?.message ?? "Cateira actualizada");
    setProcessing(false);
    if (res?.id) {
      setUser({
        ...user,
        wallet: res,
      });
    }
  };
  const bancosAngola = [
    { value: "BNA", label: "Banco Nacional de Angola (BNA)" },
    { value: "BPC", label: "Banco de Poupança e Crédito (BPC)" },
    { value: "BIC", label: "Banco BIC" },
    { value: "BFA", label: "Banco de Fomento Angola (BFA)" },
    { value: "Banco Económico", label: "Banco Económico" },
    {
      value: "BAI",
      label: "Banco Angolano de Investimentos (BAI)",
    },
    { value: "Banco Sol", label: "Banco Sol" },
    { value: "StandardBank", label: "Standard Bank Angola" },
  ];

  useEffect(() => {
    async function get() {
      const token = localStorage.getItem("token") as string;
      const data = await new TransactionSevice(token).getAlls(page);
      if (data?.pagination) {
        setLastPAge(data?.pagination?.lastPage);
      }
      setRecentTransactions(data?.data ?? []);
      setTimeout(() => {
        setIban(user?.wallet?.iban ?? "");
        setBank(user?.wallet?.bank ?? "");
        setBankHoder(user?.wallet?.walletHolder ?? "");
        setLoad(false);
      }, constants.TIMEOUT_LOADER);
    }

    get();
  }, [page]);

  return (
    <article className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      {load ? (
        <Loader />
      ) : (
        <>
          <span className="text-2xl font-bold flex items-center gap-2">
            <Hand /> Olá , {user.title}
          </span>
          {!user.isVerified && (
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950">
              <p className="text-sm text-red-900 dark:text-red-200">
                💡 <strong>IMPORTANTE :</strong> A sua conta precisa verificada
                para poder execer qualquer acção. Aguarde a verificação do seu
                perfil, isso pode levar no máximo 24hr ou consulte a equipe de
                atendimento pelo whatsap <strong>+244 957777993</strong>
              </p>
            </div>
          )}
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
          {!user.wallet && (
            <Dialog>
              <DialogTrigger asChild disabled={!user.isVerified}>
                <Button className="text-white">Registrar carteira</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastro de Carteira</DialogTitle>
                  <DialogDescription>
                    Informe o banco e o IBAN angolano da sua conta.
                  </DialogDescription>
                </DialogHeader>
                <form action="" className="flex flex-col gap-4">
                  <Label>Titular</Label>
                  <InputGroup>
                    <InputGroupInput
                      required
                      value={bankHolder}
                      onChange={(e) =>
                        setBankHoder(e.target.value.toUpperCase())
                      }
                      placeholder="Nome correto do titular"
                    />
                    <InputGroupAddon>
                      <IconUser />
                    </InputGroupAddon>
                  </InputGroup>
                  <Label>IBAN</Label>
                  <InputGroup>
                    <InputGroupInput
                      required
                      value={iban}
                      onChange={(e) => setIban(e.target.value.toUpperCase())}
                      placeholder="Insira o IBAN angolano"
                    />
                    <InputGroupAddon>
                      <IconCoin />
                    </InputGroupAddon>
                  </InputGroup>

                  <Label>Banco</Label>
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancosAngola.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </form>
                <DialogFooter className="mt- w-full grid grid-cols-2">
                  <Button
                    disabled={processing}
                    className="dark:text-white"
                    onClick={handleSubmit}
                  >
                    {processing ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Cancelar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {user.wallet && (
            <Dialog>
              <DialogTrigger asChild disabled={!user.isVerified}>
                <Button variant={"outline"} className="text-white">
                  Actualizar carteira
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastro de Carteira</DialogTitle>
                  <DialogDescription>
                    Informe o banco e o IBAN angolano da sua conta.
                  </DialogDescription>
                </DialogHeader>
                <form action="" className="flex flex-col gap-4">
                  <Label>Titular</Label>
                  <InputGroup>
                    <InputGroupInput
                      required
                      value={bankHolder}
                      onChange={(e) =>
                        setBankHoder(e.target.value.toUpperCase())
                      }
                      placeholder="Nome correto do titular"
                    />
                    <InputGroupAddon>
                      <IconUser />
                    </InputGroupAddon>
                  </InputGroup>
                  <Label>IBAN</Label>
                  <InputGroup>
                    <InputGroupInput
                      required
                      value={iban}
                      onChange={(e) => setIban(e.target.value.toUpperCase())}
                      placeholder="Insira o IBAN angolano"
                    />
                    <InputGroupAddon>
                      <IconCoin />
                    </InputGroupAddon>
                  </InputGroup>

                  <Label>Banco</Label>
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancosAngola.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </form>
                <DialogFooter className="mt- w-full grid grid-cols-2">
                  <Button
                    disabled={processing}
                    className="dark:text-white"
                    onClick={update}
                  >
                    {processing ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Actualizar"
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Cancelar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <span className="mt-4">
            {!isArrayMappble(recentTrasactions) ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderRoot />
                  </EmptyMedia>
                  <EmptyTitle>Sem transações</EmptyTitle>
                  <EmptyDescription>
                    Assim que os pagamentos começarem a surgir apareceram aqui
                    os 5 mais recentes pagamento
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <span className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h1 className="opacity-80">Trasanções</h1>
                  <p className="text-xs opacity-80">
                    {page} de {lastPage}{" "}
                  </p>
                </div>

                <span className="flex flex-col gap-3">
                  {recentTrasactions.map((item, idx) => (
                    <RecentTransaction data={item} key={idx} />
                  ))}
                  <p className="text-xs mt-5 text-center dark:opacity-90">
                    Aqui aparece apenas as 20 transações recentes , o restante
                    podes consultar no teu sistema!
                  </p>
                </span>
              </span>
            )}
          </span>
        </>
      )}
    </article>
  );
}
