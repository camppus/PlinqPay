"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { toNumber } from "@/lib/utils";
import { ITransaction, IWithdrawal } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface Props {
  transactions: ITransaction[];
  withdraws: IWithdrawal[];
}

const chartConfig = {
  in: {
    label: "Entradas",
    color: "var(--primary)",
  },
  out: {
    label: "Saques",
    color: "hsl(var(--destructive))",
  },
  available: {
    label: "Disponível",
    color: "hsl(var(--success))",
  },
} satisfies ChartConfig;

export function AdminFinanceChart({ transactions, withdraws }: Props) {
  const chartData = React.useMemo(() => {
    const events: {
      date: string;
      time: number;
      in: number;
      out: number;
    }[] = [];

    transactions
      .filter((t) => t.status === "PAID")
      .forEach((t) => {
        events.push({
          date: new Date(t.createdAt).toLocaleDateString("pt"),
          time: new Date(t.createdAt).getTime(),
          in: toNumber(t.total),
          out: 0,
        });
      });

    withdraws
      .filter((w) => w.status === "APPROVED" || w.status === "PAID")
      .forEach((w) => {
        events.push({
          date: new Date(w.createdAt).toLocaleDateString("pt"),
          time: new Date(w.createdAt).getTime(),
          in: 0,
          out: toNumber(w.amount),
        });
      });

    events.sort((a, b) => a.time - b.time);

    let available = 0;

    return events.map((e) => {
      available += e.in - e.out;

      return {
        date: e.date,
        in: e.in,
        out: e.out,
        available,
      };
    });
  }, [transactions, withdraws]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financeiro</CardTitle>
        <CardDescription>Evolução de entradas, saques e saldo</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-65 w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillIn" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-in)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-in)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillOut" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-out)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-out)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillAvailable" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-available)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-available)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("pt-AO", {
                  day: "2-digit",
                  month: "short",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) =>
                    `${Number(value).toLocaleString("pt-AO")} Kz`
                  }
                />
              }
            />

            <Area
              type="natural"
              dataKey="in"
              stroke="var(--color-in)"
              fill="url(#fillIn)"
            />
            <Area
              type="natural"
              dataKey="out"
              stroke="var(--color-out)"
              fill="url(#fillOut)"
            />
            <Area
              type="natural"
              dataKey="available"
              stroke="var(--color-available)"
              fill="url(#fillAvailable)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
