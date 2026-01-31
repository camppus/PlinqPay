"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { IApiSecretKey, Role } from "@/types";
import { IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";
import ApiKeyService from "@/services/keys";
import { useUser } from "@/context/UserContext";
import TransactionSevice from "@/services/Transaction";

export function ApiKeyCard({ data }: { data: IApiSecretKey }) {
  const { user } = useUser();

  if (!user) {
    return null;
  }
  const { isActive, title, createdAt, id, publicKey, secretKey } = data;
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [active, setActive] = useState(isActive);

  async function updateStatus() {
    const token = localStorage.getItem("token") as string;
    const resApi = await new ApiKeyService(token).toogle(id);
    return resApi;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-background p-5 shadow-sm transition hover:shadow-md">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-blue-500/10" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">{title}</h3>
        </div>

        <Switch
          checked={active}
          onCheckedChange={async (e) => {
            const data = await updateStatus();
            if (data?.message) {
              toast.info(data?.message);
              return;
            }
            setActive(e);
            const status = data?.status;
            toast.info(`Chave ${status ? "activada" : "desactivada"}`);
          }}
        />
      </div>

      <div className="mt-2">
        <Badge className=" text-white" variant={active ? "default" : "outline"}>
          {active ? "Ativa" : "Desativada"}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs text-muted-foreground">Public Key</p>
        <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1 font-mono text-xs">
          <span className="flex-1 truncate">
            {visible ? publicKey : "********************"}
          </span>

          <span className=" flex items-center gap-2">
            <span onClick={() => setVisible(!visible)}>
              {visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </span>
            <Button
              onClick={() => {
                toast.info("Chave copiado");
                navigator.clipboard.writeText(publicKey);
              }}
              size={"icon"}
              variant={"outline"}
            >
              <IconCopy />
            </Button>
          </span>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs text-muted-foreground mb-2">Secret Key</p>
        <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1 font-mono text-xs">
          <span className="flex-1 truncate">
            {visible ? secretKey : "********************"}
          </span>

          <span className=" flex items-center gap-2">
            <span onClick={() => setVisible(!visible)}>
              {visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </span>
            <Button
              onClick={() => {
                toast.info("Chave copiado");
                navigator.clipboard.writeText(secretKey ?? "");
              }}
              size={"icon"}
              variant={"outline"}
            >
              <IconCopy />
            </Button>
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Criada em</span>
        <span>{new Date(createdAt).toLocaleDateString("pt")}</span>
      </div>

      <div className="flex justify-end items-center w-full place-items-end">
        <Button disabled={processing} className=" text-white" onClick={async() => {
          setProcessing(true)
          const data = await new TransactionSevice("").create("100", publicKey, user)
          if (data?.data) {
            toast.info("Pagamento criado com sucesso", {
              description: "Acesse a aba principal e veja os detalhes"
            })
          }
          setProcessing(false)
        }}>
          {!processing ? "Testar" : <Loader2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
