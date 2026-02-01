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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import Loader from "@/components/Loader";
import { isArrayMappble } from "@/lib/utils";
import constants from "@/constants";
import { Istats, IWithdrawal, PaymentStatus } from "@/types";
import Stats from "@/components/Stats";
import WithdrawlsSevice from "@/services/Widthdralls";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { statusMap } from "@/components/Transactions";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { IconFile, IconMessage } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFile } from "@/actions";
import { toast } from "sonner";

export default function Withdrawals() {
  const [isLoad, setIsLoad] = useState(true);
  const [withdrawals, setWithdrawals] = useState<IWithdrawal[]>([]);
  const [stats, setStats] = useState<Istats[]>([]);
  const [message, setMessage] = useState(
    "Saque não pode ser processado por motivos internos",
  );
  const [status, setStatus] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [id, setId] = useState("");
  const [processing, setProcessing] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPAge] = useState(1);
  useEffect(() => {
    async function getAlls() {
      const token = localStorage.getItem("token") as string;
      const service = new WithdrawlsSevice(token);
      const data = await service.getAll(page);
      const users = (data?.data ?? []) as IWithdrawal[];
      setWithdrawals([...users]);
      setStats(data?.stats ?? []);
      setTimeout(() => setIsLoad(false), constants.TIMEOUT_LOADER);
      if (data?.pagination) {
        setLastPAge(data?.pagination?.lastPage);
      }
    }
    getAlls();
  }, [page]);

  if (isLoad) return <Loader />;

  return (
    <section className="flex flex-col gap-6">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid  gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs  lg:grid-cols-3 md:grid-cols-2 ">
        {isArrayMappble(stats) &&
          stats.map((item, idx) => <Stats key={idx} data={item} />)}
      </div>

      <span className=" px-4 lg:px-6">
        <Table className="rounded-lg overflow-hidden">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Iban</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Ordenante</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Comprovativo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className=" flex gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {item?.companie?.title.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1>{item?.companie?.title}</h1>
                      <small>{item?.companie?.email}</small>
                      <small>{item?.companie?.phone}</small>
                    </div>
                  </span>
                </TableCell>
                <TableCell>
                  {Number(item.amount).toLocaleString("pt")}, 00 kz
                </TableCell>
                <TableCell>{item?.wallet?.iban}</TableCell>
                <TableCell>{item?.wallet?.bank}</TableCell>
                <TableCell>{item?.wallet?.walletHolder}</TableCell>
                <TableCell>
                  <Badge variant={"outline"}>
                    {statusMap[item.status].icon}
                    {statusMap[item.status].title}
                  </Badge>
                </TableCell>
                <TableCell>{item.notes || "-"}</TableCell>
                <TableCell>
                  {item.fileUrl ? (
                    <a
                      href={`/${item.fileUrl}`}
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
                  <span className="flex flex-col gap-1">
                    <small>
                      Criado :{" "}
                      {new Date(item.createdAt).toLocaleDateString("pt")}
                    </small>

                    {item.approvedAt && (
                      <small>
                        Liberado :{" "}
                        {new Date(item.approvedAt).toLocaleDateString("pt")}
                      </small>
                    )}
                    {item.revokedAt && (
                      <small>
                        Cancelado :{" "}
                        {new Date(item.revokedAt).toLocaleDateString("pt")}
                      </small>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={item.status != PaymentStatus.PENDING}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setId(item.id);
                        }}
                      >
                        Ações
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        {!status && (
                          <>
                            <DialogTitle>Actualize o Saque</DialogTitle>
                            <DialogDescription>
                              prenche os campos necessários parafazer o mesmo
                            </DialogDescription>
                          </>
                        )}
                      </DialogHeader>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setProcessing(true);
                          const formdata = new FormData();
                          let fileUrl = "";
                          if (status == "APPROVED" && file) {
                            formdata.append("file", file);
                            const { message, file: fileData } =
                              await uploadFile(formdata);
                            if (message != "sucesso") {
                              toast.info(message);
                              setProcessing(false);
                              return;
                            }
                            fileUrl = String(fileData);
                          }

                          const token = localStorage.getItem("token") as string;
                          const service = new WithdrawlsSevice(token);
                          const data = await service.update({
                            fileUrl,
                            notes: message,
                            id,
                            status: String(status),
                          });
                          toast.info(
                            data?.updated
                              ? "Saque modificado"
                              : "Erro ao actualizar o saque",
                          );
                          console.log(data);
                          setProcessing(false);
                          setId("");
                          setMessage("");
                          setStatus(null);
                        }}
                        className="flex flex-col  gap-3"
                      >
                        {!status ? (
                          <>
                            <Label>Estado</Label>
                            <Select
                              onValueChange={(e) => {
                                setStatus(e);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="APPROVED">
                                  Aprovado
                                </SelectItem>
                                <SelectItem value="REJECTED">
                                  Rejeitado
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <small className="text-xs  opacity-80">
                              Escolhe um estado para poder liberar outros campos
                            </small>
                          </>
                        ) : (
                          <>
                            <h1 className="text-2xl text-center text-blue-500 font-bold mb-3">
                              {status == "APPROVED"
                                ? "Aprovação de saque"
                                : "Reprovação de saque"}
                            </h1>
                            {status == "APPROVED" ? (
                              <>
                                <Label>Comprovativo</Label>
                                <InputGroup>
                                  <InputGroupInput
                                    type="file"
                                    name="file"
                                    id="file"
                                    placeholder="comprovativo"
                                    onChange={(e) => {
                                      setFile(
                                        e.target.files
                                          ? e.target.files[0]
                                          : null,
                                      );
                                    }}
                                  />
                                  <InputGroupAddon>
                                    <IconFile />
                                  </InputGroupAddon>
                                </InputGroup>
                              </>
                            ) : (
                              <>
                                <Label>Nota de provação</Label>
                                <InputGroup>
                                  <InputGroupTextarea
                                    placeholder="Preenche o motivo pelo qual estas a reprovar o saque"
                                    value={message}
                                    onChange={(e) => {
                                      setMessage(e.target.value);
                                    }}
                                    spellCheck={false}
                                  />
                                </InputGroup>
                              </>
                            )}
                          </>
                        )}

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <Button type="submit" className="text-white">
                            {processing ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Actualizar"
                            )}
                          </Button>
                          <Button type="button" variant={"outline"}>
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
            variant="outline"
            className="rounded-full"
            size="icon"
          >
            <ArrowRight />
          </Button>
        </span>
      </span>
    </section>
  );
}
