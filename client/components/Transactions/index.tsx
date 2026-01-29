import { ITransaction, PaymentStatus, Role } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaThumbsUp,
  FaBan,
} from "react-icons/fa";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { isArrayMappble } from "@/lib/utils";
import TransactionSevice from "@/services/Transaction";
import constants from "@/constants";
import Loader from "@/components/Loader";
import { useUser } from "@/context/UserContext";
import { IconShoppingBag, IconShoppingCart } from "@tabler/icons-react";

export const statusMap: Record<
  PaymentStatus,
  { icon: ReactNode; color: string; title: string }
> = {
  [PaymentStatus.PAID]: {
    icon: <FaCheckCircle className="text-green-500" />,
    color: "green",
    title: "Pago",
  },
  [PaymentStatus.PENDING]: {
    icon: <FaClock className="text-yellow-500" />,
    color: "yellow",
    title: "Pendente",
  },
  [PaymentStatus.FAILED]: {
    icon: <FaTimesCircle className="text-red-500" />,
    color: "red",
    title: "Falhou",
  },
  [PaymentStatus.APPROVED]: {
    icon: <FaCheckCircle className="text-green-500" />,
    color: "blue",
    title: "Pago",
  },
  [PaymentStatus.REJECTED]: {
    icon: <FaBan className="text-red-500" />,
    color: "red",
    title: "Falhou",
  },
};

export function RecentTransaction({ data }: { data: ITransaction }) {
  const status = statusMap[data.status];

  return (
    <div className="flex flex-col border p-3 px-2 rounded-md ">
      <div className="flex justify-between  p-3 rounded-md items-center">
        <span className="flex gap-2 items-center">
          <Avatar>
            <AvatarFallback className="font-black uppercase">
              {data?.client?.name?.[0]}
              {data?.client?.name
                ? data.client.name[data.client.name.length - 1]
                : ""}
            </AvatarFallback>
          </Avatar>
          <span>
            <p>{data?.client?.name}</p>
            <small className="opacity-80 text-xs">
              {new Date(data.createdAt).toLocaleDateString("pt")}
            </small>
          </span>
        </span>

        <span className="flex flex-col gap-1 justify-end items-end">
          <h1
            className={`text-lg font-medium opacity-60 text-${status.color}-500`}
          >
            {status.color.includes("red") ? "-" : "+"}{" "}
            {data.total.toLocaleString("pt")},00 kz
          </h1>
          <Badge variant="outline" className="flex items-center gap-1">
            {status.icon} <span>{status.title}</span>
          </Badge>
        </span>
      </div>
      <Button
        asChild
        variant={"link"}
        className="w-[20%] text-white underline text-xs"
      >
        <Link href={`/dashboard/companie/${data.id}`}>Detalhes</Link>
      </Button>
    </div>
  );
}

export function TransacttionDetails({ id }: { id: string }) {
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [load, setLoad] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    async function get() {
      const token = localStorage.getItem("token") as string;
      const data = await new TransactionSevice(token).getById(id as string);
      console.log(data);

      if (data?.id) {
        setTransaction(data);
      }

      setTimeout(() => {
        setLoad(false);
      }, constants.TIMEOUT_LOADER);
    }

    get();
  }, [id]);

  if (load) {
    return (
      <section className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
        <Loader />
      </section>
    );
  }
  if (!transaction) {
    return (
      <p className="p-5 text-center text-red-500">Transação não encontrada</p>
    );
  }

  const status = statusMap[transaction.status];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalhes</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          {status.icon} <span>{status.title}</span>
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
            <Badge className="text-white mt-2">
              <IconShoppingCart /> Cliente
            </Badge>
          </div>
        </div>

        {user && user?.role == Role.SUPERCOMPANIE && (
          <div className="flex items-center gap-4 border rounded-xl p-4 bg-background shadow-sm">
            <Avatar>
              <AvatarFallback className="font-black uppercase">
                {transaction.companie?.title[0]}
                {
                  transaction.companie?.title[
                    transaction.companie?.title.length - 1
                  ]
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{transaction.companie?.title}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.companie?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.companie?.phone}
              </p>
              <Badge className="text-white mt-2" variant={"outline"}>
                <IconShoppingCart /> Vendedor
              </Badge>
            </div>
          </div>
        )}
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

      <div className="border rounded-xl bg-background shadow-sm p-4 grid grid-cols-2 gap-2">
        <div className="border-r">
          <p className="text-xs text-muted-foreground">Referencia</p>
          <p>{transaction.reference}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Entidade</p>
          <p className="truncate">{transaction.entity}</p>
        </div>
      </div>

      <div className="border rounded-xl bg-background shadow-sm p-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Criada em</p>
          <p>{new Date(transaction.createdAt).toLocaleDateString("pt")}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Atualizada em</p>
          <p>{new Date(transaction.updatedAt).toLocaleDateString("pt")}</p>
        </div>

        {transaction?.paidAt && (
          <div>
            <p className="text-xs text-muted-foreground">Pago aos</p>
            <p> {new Date(transaction.paidAt).toLocaleDateString("pt")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
