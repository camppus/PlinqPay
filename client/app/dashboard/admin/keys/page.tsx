"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconTrendingUp,
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react";
import Loader from "@/components/Loader";
import constants from "@/constants";
import { IApiSecretKey, Istats } from "@/types";
import { apiKeysMock } from "@/constants/mocks/keys";
import { ApiKeyCard } from "@/components/ApiSecret";
import { isArrayMappble } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";

export default function ApiKeys() {
  const [isLoad, setIsLoad] = useState(true);
  const [keys, setKeys] = useState<IApiSecretKey[]>([]);

  const [stats, setStats] = useState<Istats[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setKeys(apiKeysMock);
      setIsLoad(false);
      setStats([
        {
          title: "Total de Chaves",
          subtitle: "Chaves cadastradas",
          description:
            "Número total de chaves de API registradas na plataforma",
          amount: keys.length, // total de chaves
          isCoin: false,
        },
        {
          title: "Chaves Ativas",
          subtitle: "Chaves em uso",
          description: "Chaves de API que estão ativas e podem ser usadas",
          amount: keys.filter((k) => k.isActive).length, // total ativas
          isCoin: false,
        },
        {
          title: "Chaves Inativas",
          subtitle: "Chaves desativadas",
          description: "Chaves que foram desativadas pelo admin",
          amount: keys.filter((k) => !k.isActive).length, // total inativas
          isCoin: false,
        },
        {
          title: "Chaves Recentes",
          subtitle: "Últimas criadas",
          description: "Número de chaves criadas nos últimos 7 dias",
          amount: keys.filter(
            (k) =>
              new Date(k.createdAt).getTime() >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(),
          ).length,
          isCoin: false,
        },
      ]);
    }, constants.TIMEOUT_LOADER);
  }, []);

  return (
    <section className="flex flex-col gap-4 w-full">
      {isLoad ? (
        <Loader />
      ) : (
        <>
          {/* Cards de estatísticas */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {isArrayMappble(stats) &&
              stats.map((item, idx) => (
                <Card className="@container/card" key={idx}>
                  <CardHeader>
                    <CardDescription>{item.title}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {item.amount.toLocaleString("pt")}
                      {item.isCoin && ",00 kz"}
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        <IconTrendingUp />
                        +12.5%
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {item.subtitle} <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                      {item.description}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
          <span className="grid  lg:grid-cols-3 grid-cols-1 gap-4 px-6 mt-20 ">
            {keys.map((item, idx) => (
              <ApiKeyCard data={item} key={idx} />
            ))}
          </span>
          <div className="flex items-center justify-between px-4 mt-20">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              100 de 1000
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Items por página
                </Label>
                <Select value={`1`} onValueChange={(value) => {}}>
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue placeholder={1} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Página 1 de 10
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button variant="outline" className="size-8" size="icon">
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button variant="outline" className="size-8" size="icon">
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
