"use client";
import { AdminFinanceChart } from "@/components/chart-area-interactive";
import { useEffect, useState } from "react";
import TransactionSevice from "@/services/Transaction";
import { ITransaction, IWithdrawal } from "@/types";
import { Istats, ITenant } from "@/types";
import Loader from "@/components/Loader";
import constants from "@/constants";
import { isArrayMappble } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Stats from "@/components/Stats";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { statusMap } from "@/components/Transactions";

export default function Page() {
  const [load, setLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPAge] = useState(1);
  const [stats, setStats] = useState<Istats[]>([]);
  const [withdraws, setWidthDrawsl] = useState<IWithdrawal[]>([]);
  const [recentTrasactions, setRecentTransactions] = useState<ITransaction[]>(
    [],
  );
  useEffect(() => {}, []);
  useEffect(() => {
    async function get() {
      const token = localStorage.getItem("token") as string;
      const data = await new TransactionSevice(token).getAll(page);
      if (data?.pagination) {
        setLastPAge(data?.pagination?.lastPage);
      }
      setRecentTransactions(data?.data ?? []);
      setStats(data?.stats?.stats ?? []);
      setWidthDrawsl(data?.stats?.widhraws ?? []);
      console.log(data);
      if (data?.pagination) {
        setLastPAge(data?.pagination?.lastPage);
      }
      setTimeout(() => {
        setLoad(false);
      }, constants.TIMEOUT_LOADER);
    }

    get();
  }, [page]);
  return (
    <section className="flex flex-col gap-5">
      {load ? (
        <Loader />
      ) : (
        <>
          {" "}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card  *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6  px-4 grid lg:grid-cols-3 gap-4 md:grid-cols-2 ">
            {isArrayMappble(stats) &&
              stats.map((item, idx) => <Stats key={idx} data={item} />)}
          </div>
          <span className="px-4 lg:px-6">
            <AdminFinanceChart
              transactions={recentTrasactions}
              withdraws={withdraws}
            />
          </span>
          <span className="px-4 lg:px-6">
            <Table className="rounded-lg overflow-hidden">
              <TableHeader className="bg-muted sticky top-0 z-10">
                <TableRow>
                  <TableHead>Empresa</TableHead>
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
                {isArrayMappble(recentTrasactions) ? (
                  recentTrasactions.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <span className="flex gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {item?.companie?.title?.slice(0, 2)}
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
                        {Number(item.total).toLocaleString("pt")} kz
                      </TableCell>
                      <TableCell>{item.reference}</TableCell>
                      <TableCell>{item.tax} %</TableCell>
                      <TableCell>
                        {Number(item.subtotal).toLocaleString("pt")} kz
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
          </span>
        </>
      )}
    </section>
  );
}
