import { ITransaction, PaymentStatus } from "@/types";
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
