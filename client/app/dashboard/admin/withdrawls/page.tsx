"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";
import { IconCheck, IconX, IconFile, IconEdit } from "@tabler/icons-react";
import { formatCurrency, isArrayMappble } from "@/lib/utils";
import constants from "@/constants";
import { Istats, IWithdrawal } from "@/types";
import Stats from "@/components/Stats";
import WithdrawlsSevice from "@/services/Widthdralls";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { statusMap } from "@/components/Transactions";
import { ArrowLeft, ArrowRight } from "lucide-react";

const withdrawalsMock = [
  {
    id: "1",
    user: "João Silva",
    amount: 50000,
    wallet: "Kwanza Wallet 1234",
    status: "PENDENTE",
    note: "",
    proof: "",
    createdBy: "Admin1",
  },
  {
    id: "2",
    user: "Maria Costa",
    amount: 120000,
    wallet: "USD Wallet 5678",
    status: "APROVADO",
    note: "Pagamento confirmado",
    proof: "comprovativo.pdf",
    createdBy: "Admin2",
  },
  {
    id: "3",
    user: "Pedro Gomes",
    amount: 25000,
    wallet: "Kwanza Wallet 4321",
    status: "REJEITADO",
    note: "Saldo insuficiente",
    proof: "",
    createdBy: "Admin1",
  },
];

export default function Withdrawals() {
  const [isLoad, setIsLoad] = useState(true);
  const [withdrawals, setWithdrawals] = useState<IWithdrawal[]>([]);
  const [stats, setStats] = useState<Istats[]>([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPAge] = useState(1);
  useEffect(() => {
    async function getAlls() {
      const token = localStorage.getItem("token") as string;
      const service = new WithdrawlsSevice(token);
      const data = await service.getAll(page);
      const users = (data?.data ?? []) as IWithdrawal[];
      console.log(data);
      setWithdrawals(users);
      setStats(data?.stats ?? []);
      setTimeout(() => setIsLoad(false), constants.TIMEOUT_LOADER);
      if (data?.pagination) {
        setLastPAge(data?.pagination?.lastPage);
      }
    }
    getAlls();
  }, [page]);

  const updateWithdrawal = (
    id: string,
    updates: Partial<(typeof withdrawalsMock)[0]>,
  ) => {};

  if (isLoad) return <Loader />;

  return (
    <section className="flex flex-col gap-6">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid  gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs  lg:grid-cols-3 md:grid-cols-2 ">
        {isArrayMappble(stats) &&
          stats.map((item, idx) => <Stats key={idx} data={item} />)}
      </div>

      <span className=" px-4 lg:px-6">
        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Iban</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Ordenante</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Comprovativo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className=" flex gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {item?.companie?.title.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1>{item?.companie?.title}</h1>
                      <small>{item?.companie?.email}</small>
                      <small>{item?.companie?.phone}</small>
                    </div>
                  </span>
                </TableCell>
                <TableCell>
                  {Number(item.amount).toLocaleString("pt")}, 00 kz
                </TableCell>
                <TableCell>{item?.wallet?.iban}</TableCell>
                <TableCell>{item?.wallet?.bank}</TableCell>
                <TableCell>{item?.wallet?.walletHolder}</TableCell>
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
                <TableCell>
                  <span className="flex flex-col gap-1">
                    <small>
                      Criado :{" "}
                      {new Date(item.createdAt).toLocaleDateString("pt")}
                    </small>

                    {item.approvedAt && (
                      <small>
                        Liberado :{" "}
                        {new Date(item.approvedAt).toLocaleDateString("pt")}
                      </small>
                    )}
                    {item.revokedAt && (
                      <small>
                        Cancelado :{" "}
                        {new Date(item.revokedAt).toLocaleDateString("pt")}
                      </small>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Ações
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          updateWithdrawal(item.id, { status: "APROVADO" })
                        }
                      >
                        <IconCheck className="mr-2 size-4" /> Aprovar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateWithdrawal(item.id, { status: "REJEITADO" })
                        }
                      >
                        <IconX className="mr-2 size-4" /> Rejeitar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <span className="flex gap-3 mt-2 justify-center">
          <Button
            disabled={page <= 1 || isLoad}
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
            disabled={page >= lastPage || isLoad}
            onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
            variant="outline"
            className="rounded-full"
            size="icon"
          >
            <ArrowRight />
          </Button>
        </span>
      </span>
    </section>
  );
}
