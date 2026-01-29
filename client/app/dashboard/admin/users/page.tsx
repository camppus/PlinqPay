"use client";
import { Istats, ITenant } from "@/types";
import Loader from "@/components/Loader";
import constants from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { isArrayMappble } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
  IconShield,
  IconLoader,
} from "@tabler/icons-react";
import TenantService from "@/services/tenant";
import Stats from "@/components/Stats";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Users() {
  const [isLoad, setIsLoad] = useState(true);
  const [stats, setStats] = useState<Istats[]>([]);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [filter, setFilter] = useState<
    "all" | "active" | "verified" | "rejected"
  >("all");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPAge] = useState(1);
  useEffect(() => {
    async function getAlls() {
      const token = localStorage.getItem("token") as string;
      const service = new TenantService(token);
      const data = await service.getAlls(page);
      const users = (data?.data ?? []) as ITenant[];
      console.log(data);
      setTenants(users);
      setStats(data?.stats ?? []);
      setTimeout(() => setIsLoad(false), constants.TIMEOUT_LOADER);
      if (data?.pagination) {
        setLastPAge(data?.pagination?.lastPage);
      }
    }
    getAlls();
  }, [page]);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    const token = localStorage.getItem("token") as string;
    const service = new TenantService(token);
    const data = await service.toogle(id);
    toast.info(
      data?.data ? "Estatus actualizado" : "Erro ao actualizar status",
    );
    if (data?.data) {
      setTenants((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, isActive: newStatus, isVerified: newStatus }
            : t,
        ),
      );
    }
  };

  return (
    <section className="flex flex-col gap-4 w-full">
      {isLoad ? (
        <Loader />
      ) : (
        <>
          {/* Stats */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {isArrayMappble(stats) &&
              stats.map((item, idx) => <Stats key={idx} data={item} />)}
          </div>

          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as any)}
            className="mt-10 flex-col gap-6 px-6"
          >
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="rejected">Inativos </TabsTrigger>
            </TabsList>
            <TabsContent
              value={filter}
              className="flex flex-col gap-4 overflow-auto"
            >
              <Table className="rounded-lg overflow-hidden">
                <TableHeader className="bg-muted sticky top-0 z-10">
                  <TableRow>
                    <TableHead colSpan={2}>Perfil</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contatos</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Faturado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Parceiro desde</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {tenants.length ? (
                    tenants.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell colSpan={2}>
                          <Avatar>
                            <AvatarFallback>
                              {item.title.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <h1>{item.title}</h1>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <small>{item.email}</small>
                            <small>{item.phone}</small>
                          </div>
                        </TableCell>
                        <TableCell>
                          {Number(item.totalDisponible).toLocaleString("pt")},00
                          Kz
                        </TableCell>
                        <TableCell>
                          {Number(item.totalErned).toLocaleString("pt")},00 Kz
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.isVerified ? (
                              <IconShield className="text-green-500" />
                            ) : (
                              <IconLoader className="text-amber-500" />
                            )}
                            {item.isVerified ? "Verificado" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.createdAt).toLocaleDateString("pt")}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={item.isVerified}
                            onCheckedChange={async (checked) =>
                              await handleStatusChange(item.id, checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/admin/users/${item.id}`}>
                            <Button variant={"outline"}>Detalhes</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Sem resulttado encotrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>{" "}
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
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, lastPage))
                  }
                  variant="outline"
                  className="rounded-full"
                  size="icon"
                >
                  <ArrowRight />
                </Button>
              </span>
            </TabsContent>
          </Tabs>
        </>
      )}
    </section>
  );
}
