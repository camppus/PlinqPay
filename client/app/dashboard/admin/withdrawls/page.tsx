"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";
import { IconCheck, IconX, IconFile, IconEdit } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/utils";

// Mock de saques
const withdrawalsMock = [
  {
    id: "1",
    user: "João Silva",
    amount: 50000,
    wallet: "Kwanza Wallet 1234",
    status: "PENDENTE",
    note: "",
    proof: "",
    createdBy: "Admin1",
  },
  {
    id: "2",
    user: "Maria Costa",
    amount: 120000,
    wallet: "USD Wallet 5678",
    status: "APROVADO",
    note: "Pagamento confirmado",
    proof: "comprovativo.pdf",
    createdBy: "Admin2",
  },
  {
    id: "3",
    user: "Pedro Gomes",
    amount: 25000,
    wallet: "Kwanza Wallet 4321",
    status: "REJEITADO",
    note: "Saldo insuficiente",
    proof: "",
    createdBy: "Admin1",
  },
];

export default function Withdrawals() {
  const [isLoad, setIsLoad] = useState(true);
  const [withdrawals, setWithdrawals] = useState(withdrawalsMock);

  useEffect(() => {
    setTimeout(() => setIsLoad(false), 1000); // simula loading
  }, []);

  const updateWithdrawal = (
    id: string,
    updates: Partial<(typeof withdrawalsMock)[0]>,
  ) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    );
  };

  if (isLoad) return <Loader />;

  return (
    <section className="flex flex-col gap-6 px-4 lg:px-6">
      <h1 className="text-2xl font-semibold">Gerenciamento de Saques</h1>

      <Table className="rounded-lg overflow-hidden">
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Carteira</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Comprovativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.user}</TableCell>
              <TableCell>{formatCurrency(item.amount)}</TableCell>
              <TableCell>{item.wallet}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === "APROVADO"
                      ? "default"
                      : item.status === "PENDENTE"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.note || "-"}</TableCell>
              <TableCell>
                {item.proof ? (
                  <a
                    href={`/${item.proof}`}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    Ver
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Ações
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateWithdrawal(item.id, { status: "APROVADO" })
                      }
                    >
                      <IconCheck className="mr-2 size-4" /> Aprovar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateWithdrawal(item.id, { status: "REJEITADO" })
                      }
                    >
                      <IconX className="mr-2 size-4" /> Rejeitar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <label
                        htmlFor={`note-${item.id}`}
                        className="flex items-center gap-2 w-full cursor-pointer"
                      >
                        <IconEdit className="size-4" /> Adicionar Nota
                      </label>
                      <input
                        id={`note-${item.id}`}
                        type="text"
                        placeholder="Digite a nota"
                        className="hidden"
                        onBlur={(e) =>
                          updateWithdrawal(item.id, { note: e.target.value })
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <label
                        htmlFor={`proof-${item.id}`}
                        className="flex items-center gap-2 w-full cursor-pointer"
                      >
                        <IconFile className="size-4" /> Adicionar Comprovativo
                      </label>
                      <input
                        id={`proof-${item.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          updateWithdrawal(item.id, {
                            proof: e.target.files?.[0]?.name || "",
                          })
                        }
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
