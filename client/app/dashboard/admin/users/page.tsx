"use client";
import { Istats, ITenant } from "@/types";
import Loader from "@/components/Loader";
import constants from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { isArrayMappble } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function Users() {
  const [isLoad, setIsLoad] = useState(true);
  const [stats, setStats] = useState<Istats[]>([]);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [filter, setFilter] = useState<
    "all" | "active" | "verified" | "rejected"
  >("all");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    lastPage: 1,
    total: 0,
  });

  useEffect(() => {
    async function getAlls() {
      const token = localStorage.getItem("token") as string;
      const service = new TenantService(token);
      const data = await service.getAlls(1);
      const users = (data?.data ?? []) as ITenant[];
      console.log(data);
      setTenants(users);
      setStats(data?.stats ?? []);
      setTimeout(() => setIsLoad(false), constants.TIMEOUT_LOADER);
      const pages = data?.pagination;
    }
    getAlls();
  }, []);

  const filteredTenants = useMemo(() => {
    if (!tenants) return [];
    switch (filter) {
      case "active":
        return tenants.filter((t) => t.isActive || t.isVerified);
      case "rejected":
        return tenants.filter((t) => !t.isActive);
      case "all":
      default:
        return tenants;
    }
  }, [tenants, filter]);
  const paginatedTenants = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredTenants.slice(start, end);
  }, [filteredTenants, pagination]);
  const totalPages = pagination.lastPage;

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
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {paginatedTenants.length ? (
                    paginatedTenants.map((item, idx) => (
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
              </Table>
              <div className="flex items-center justify-between px-4">
                <div>
                  Página {pagination.page} de {pagination.lastPage}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setPagination((p) => ({ ...p, page: 1 }))}
                    disabled={pagination.page === 1}
                  >
                    <IconChevronsLeft />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        page: Math.max(p.page - 1, 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                  >
                    <IconChevronLeft />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        page: Math.min(p.page + 1, pagination.lastPage),
                      }))
                    }
                    disabled={pagination.page === pagination.lastPage}
                  >
                    <IconChevronRight />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        page: pagination.lastPage,
                      }))
                    }
                    disabled={pagination.page === pagination.lastPage}
                  >
                    <IconChevronsRight />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </section>
  );
}
