"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ITransaction,
  IWithdrawal,
  ITenant,
  IApiSecretKey,
  IWallet,
} from "@/types";
import TenantService from "@/services/tenant";
import constants from "@/constants";
import { useParams } from "next/navigation";
import { Wallet } from "@/components/Wallet";
import { isArrayMappble } from "@/lib/utils";
import { ApiKeyCard } from "@/components/ApiSecret";
import { BadgeAlert, BadgeCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { statusMap } from "@/components/Transactions";
import Link from "next/link";
import Stats from "@/components/Stats";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<ITenant | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [withdraws, setWithdraws] = useState<IWithdrawal[]>([]);
  const [keys, setKeys] = useState<IApiSecretKey[]>([]);
  const [wallet, setWallet] = useState<IWallet | null>(null);

  const [load, setLoad] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") as string;

    async function fetchUser() {
      setLoad(true);
      const data = await new TenantService(token).getById(String(id));
      if (data?.data) {
        const userApi: ITenant = data?.data;
        console.log(userApi);
        setUser(userApi);
        setKeys(userApi?.keys ?? []);
        setWallet(userApi?.wallet ?? null);
        setWithdraws(userApi?.withdrawals ?? []);
        setTransactions(userApi?.transactions ?? []);
      }
      setTimeout(() => setLoad(false), constants.TIMEOUT_LOADER);
    }

    fetchUser();
  }, [String(id)]);

  if (load) {
    return (
      <section className="w-full flex flex-col items-center gap-4">
        <Loader />
      </section>
    );
  }

  if (!user) {
    return (
      <p className="p-5 text-center text-red-500">Usuário não encontrado</p>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 px-4 ">
      <div className="flex items-center gap-4 p-4 relative border rounded-xl bg-background shadow-sm">
        <Avatar>
          <AvatarFallback className="font-black uppercase">
            {user.title[0]}
            {user.title[user.title.length - 1]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.title}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
          <Badge className="text-white mt-2">Empresa</Badge>
        </div>

        <span className="absolute right-3 top-3">
          {user?.isVerified ? (
            <span className="text-sm flex items-center text-green-500 gap-1">
              <BadgeCheck />
            </span>
          ) : (
            <span className="text-sm flex items-center text-red-500 gap-1">
              <BadgeAlert />
            </span>
          )}
        </span>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-5">
          <TabsTrigger value="profile">Carteira</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="withdraws">Saques</TabsTrigger>
          <TabsTrigger value="keys">Chaves</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          {isArrayMappble(keys) ? (
            <span className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 ">
              {keys.map((item, idx) => (
                <ApiKeyCard
                  key={idx}
                  data={{
                    ...item,
                    secretKey: "",
                  }}
                />
              ))}
            </span>
          ) : (
            <p className="text-sm text-center">Sem chaves de api</p>
          )}
        </TabsContent>
        <TabsContent value="profile">
          <div className="grid md:grid-cols-2 gap-4 mb-2">
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
          <span className=" flex flex-col gap-3">
            <Wallet
              bankName={wallet?.bank ?? ""}
              iban={wallet?.iban ?? ""}
              userName={wallet?.walletHolder ?? ""}
            />
          </span>
        </TabsContent>

        <TabsContent value="transactions">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado aos</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border">
              {isArrayMappble(transactions) ? (
                transactions.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <span className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {item?.client?.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <h1>{item?.client?.name}</h1>
                          <small>{item?.client?.email}</small>
                          <small>{item?.client?.phone}</small>
                        </div>
                      </span>
                    </TableCell>
                    <TableCell>
                      {Number(item.total).toFixed(2)} kz
                    </TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.tax} %</TableCell>
                    <TableCell>
                      {Number(item.subtotal).toFixed(2)} kz
                    </TableCell>
                    <TableCell>
                      <Badge variant={"outline"}>
                        {statusMap[item.status].icon}
                        {statusMap[item.status].title}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString("pt")}
                    </TableCell>

                    <TableCell>
                      <Link href={`/dashboard/admin/${item.id}`}>
                        <Button variant={"outline"}>Detalhes</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    Sem resulttado encotrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="withdraws">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead>Criado aos</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Comprovativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdraws.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString("pt")}
                  </TableCell>
                  <TableCell>
                    {Number(item.amount).toFixed(2)} kz
                  </TableCell>
                  <TableCell>
                    <Badge variant={"outline"}>
                      {statusMap[item.status].icon}
                      {statusMap[item.status].title}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.notes || "-"}</TableCell>
                  <TableCell>
                    {item.fileUrl ? (
                      <a
                        href={`/${item.fileUrl}`}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        Ver
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
