"use client";
import { Istats, ITenant } from "@/types";
import Loader from "@/components/Loader";
import constants from "@/constants";
import { useEffect, useId, useMemo, useState } from "react";
import { isArrayMappble } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconEye,
  IconFile,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconShield,
  IconTrendingUp,
} from "@tabler/icons-react";

import {
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { tenantsMock } from "@/constants/mocks/users";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, LoaderIcon } from "lucide-react";
import { Wallet } from "@/components/Wallet";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

export default function Users() {
  const [isLoad, setIsLoad] = useState(true);
  const [stats, setStats] = useState<Istats[]>([]);

  const [tenants, setTenants] = useState<ITenant[]>(tenantsMock);
  useEffect(() => {
    setTimeout(() => {
      setIsLoad(false);
    }, constants.TIMEOUT_LOADER);

    setStats([
      {
        title: "Total de Usuários",
        subttile: "Usuários cadastrados",
        description: "Número total de usuários registrados na plataforma",
        amount: 12480,
        isCoin: false,
      },
      {
        title: "Usuários Verificados",
        subttile: "KYC aprovado",
        description: "Usuários com identidade verificada com sucesso",
        amount: 6432,
        isCoin: false,
      },
      {
        title: "Usuários Pendentes",
        subttile: "Aguardando verificação",
        description: "Usuários que ainda não concluíram o KYC",
        amount: 1720,
        isCoin: false,
      },
      {
        title: "Usuários Bloqueados",
        subttile: "Contas suspensas",
        description: "Usuários desativados por violação ou inatividade",
        amount: 408,
        isCoin: false,
      },
    ]);
  }, []);
  const dataIds = useMemo<ITenant[]>(() => tenants || [], [tenants]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <section className="flex flex-col gap-4 w-full">
      {isLoad ? (
        <Loader />
      ) : (
        <>
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
                      {item.subttile} <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                      {item.description}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
          <Tabs
            defaultValue="all"
            className="w-full flex-col justify-start gap-6 mt-10"
          >
            <div className="flex items-center justify-between px-4 lg:px-6">
              <Label htmlFor="view-selector" className="sr-only">
                View
              </Label>
              <Select defaultValue="outline">
                <SelectTrigger
                  className="flex w-fit @4xl/main:hidden"
                  size="sm"
                  id="view-selector"
                >
                  <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="rejected">Bloqueados</SelectItem>
                  <SelectItem value="verified">Verificados</SelectItem>
                </SelectContent>
              </Select>
              <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">
                  Ativos <Badge variant="secondary">3</Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Bloqueados <Badge variant="secondary">2</Badge>
                </TabsTrigger>
                <TabsTrigger value="verified">Verificados</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <IconFile />
                  <span className="hidden lg:inline">Exportar em cv</span>
                </Button>
              </div>
            </div>

            <TabsContent
              value="all"
              className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
              <Table className="rounded-lg overflow-hidden">
                <TableHeader className="bg-muted  sticky top-0 z-10">
                  <TableRow>
                    <TableHead colSpan={2}>Perfil</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Faturado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Carteira</TableHead>
                    <TableHead>Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8 border rounded-lg">
                  {isArrayMappble(dataIds) ? (
                    <>
                      {dataIds.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell colSpan={2}>
                            <Avatar>
                              <AvatarFallback className="font-semibold ">
                                {item.title.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <h1>{item.title}</h1>
                              <small>{item.email}</small>
                              <small>{item.phone}</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            {Number(item.totalDisponible).toLocaleString("pt")},
                            00 kz
                          </TableCell>
                          <TableCell>
                            {Number(item.totalErned).toLocaleString("pt")}, 00
                            kz
                          </TableCell>
                          <TableCell>
                            <Badge variant={"outline"}>
                              {item.isVerified ? (
                                <IconShield className="text-green-500" />
                              ) : (
                                <LoaderIcon className="text-amber-500" />
                              )}
                              {item.isVerified ? "Verificado" : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item?.wallet && (
                              <div className="  gap-2 text-sm">
                                <h1>{item?.wallet.iban}</h1>
                                <small>{item?.wallet.bank}</small>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline">Acções </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel className="text-xs opacity-80 ">
                                    Perfil
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem className="justify-between">
                                    Detalhe <IconEye />
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuGroup>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Button
                                      className="w-full"
                                      variant={"outline"}
                                    >
                                      Activar
                                    </Button>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4">
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                  100 de 1000
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                  <div className="hidden items-center gap-2 lg:flex">
                    <Label
                      htmlFor="rows-per-page"
                      className="text-sm font-medium"
                    >
                      Items por página
                    </Label>
                    <Select value={`1`} onValueChange={(value) => {}}>
                      <SelectTrigger
                        size="sm"
                        className="w-20"
                        id="rows-per-page"
                      >
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
            </TabsContent>

            <TabsContent value="active" className="flex flex-col px-4 lg:px-6">
              <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent
              value="rejected"
              className="flex flex-col px-4 lg:px-6"
            >
              <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent
              value="verified"
              className="flex flex-col px-4 lg:px-6"
            >
              <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </section>
  );
}
