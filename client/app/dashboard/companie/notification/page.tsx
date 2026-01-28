"use client";

import { ArrowLeft, ArrowRight, Bell } from "lucide-react";

import { ShieldAlert, CreditCard, Wallet } from "lucide-react";
import { NotificationType } from "@/types";

export const notificationMap = {
  [NotificationType.PAYMENT]: {
    icon: CreditCard,
    color: "text-green-500 bg-green-500/10",
  },
  [NotificationType.WITHDRAWALS]: {
    icon: Wallet,
    color: "text-blue-500 bg-blue-500/10",
  },
  [NotificationType.SECURITY]: {
    icon: ShieldAlert,
    color: "text-red-500 bg-red-500/10",
  },
  [NotificationType.OTHERS]: {
    icon: Bell,
    color: "text-muted-foreground bg-muted",
  },
};

import {
  INotification,
  notificationsMock,
} from "@/constants/mocks/notifications";
import { cn, isArrayMappble } from "@/lib/utils";
import { useEffect, useState } from "react";
import NotificationService from "@/services/Notification";
import constants from "@/constants";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPAge] = useState(1);
  const [notifications, setNotification] = useState<INotification[]>([]);
  const [load, setLoad] = useState(true);
  useEffect(() => {
    async function get() {
      const token = localStorage.getItem("token") as string;
      const [read, data] = await Promise.all([
        new NotificationService(token).read(),
        new NotificationService(token).getAlls(page),
      ]);
      setNotification(data?.data ?? []);
      if (data?.pagination) {
        setLastPAge(data?.lastPage ?? 1);
      }
      setTimeout(() => {
        setLoad(false);
      }, constants.TIMEOUT_LOADER);
    }
    setMounted(true);
    get();
  }, [page]);

  if (!mounted) return null;
  return (
    <div className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      {load ? (
        <Loader />
      ) : (
        <>
          {" "}
          <span className="flex  justify-between gap-2 items-center">
            <h1 className="text-lg font-medium">Notificações</h1>
            <Bell size={20} />
          </span>
          <div className="border rounded-xl divide-y bg-background shadow-sm">
            {isArrayMappble(notifications) &&
              notifications.map((notif, idx) => {
                const Icon = notificationMap[notif.type].icon;
                const path =
                  notif.type == NotificationType.PAYMENT
                    ? `/dashboard/companie/${notif.id}`
                    : notif.type == NotificationType.WITHDRAWALS
                      ? "`/dashboard/companie/widthdrawls"
                      : "#";
                return (
                  <Link
                    href={path}
                    className={cn(
                      "flex items-start gap-4 p-4 transition relative",
                      !notif.isRead && "bg-muted/40",
                    )}
                    key={idx}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        notificationMap[notif.type].color,
                      )}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 ">
                      <p className="font-medium">{notif.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleDateString("pt")} ·{" "}
                        {new Date(notif.createdAt).toLocaleTimeString("pt")}
                      </p>
                    </div>{" "}
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <small className="text-xs absolute bottom-2 text-blue-500 underline right-3">Ver detalhes</small>
                  </Link>
                );
              })}
          </div>
          <span className="flex gap-3 mt-2 justify-center">
            <Button
              disabled={page <= 1}
              onClick={() => {
                setPage((prev) => prev - 1);
              }}
              variant={"outline"}
              className="rounded-full"
              size={"icon"}
            >
              <ArrowLeft />
            </Button>
            <Button
              disabled={page >= lastPage}
              variant={"outline"}
              className="rounded-full"
              size={"icon"}
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
            >
              <ArrowRight />
            </Button>
          </span>
        </>
      )}
    </div>
  );
}
