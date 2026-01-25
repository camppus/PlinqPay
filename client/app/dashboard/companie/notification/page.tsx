"use client";

import { Bell } from "lucide-react";

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

import { notificationsMock } from "@/constants/mocks/notifications";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      <span className="flex justify-between gap-2 items-center">
        <h1 className="text-lg font-medium">Notificações</h1>
        <Bell size={20} />
      </span>

      <div className="border rounded-xl divide-y bg-background shadow-sm">
        {notificationsMock.map((notif, idx) => {
          const Icon = notificationMap[notif.type].icon;

          return (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-4 p-4 transition",
                !notif.isRead && "bg-muted/40",
              )}
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
                  {notif.createdAt.toLocaleDateString("pt")} ·{" "}
                  {notif.createdAt.toLocaleTimeString("pt")}
                </p>
              </div>

              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
