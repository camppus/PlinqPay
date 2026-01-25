"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Key } from "lucide-react";
import { IApiSecretKey } from "@/types";

export function ApiKeyCard({ data }: { data: IApiSecretKey }) {
  const {
    companieId,
    isActive,
    title,
    createdAt,
    id,
    publicKey,
    secretKey,
    updatedAt,
    companie,
  } = data;
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(isActive);

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

        <Switch checked={active} onCheckedChange={setActive} />
      </div>

      {/* Status */}
      <div className="mt-2">
        <Badge variant={active ? "default" : "outline"}>
          {active ? "Ativa" : "Desativada"}
        </Badge>
      </div>

      {/* Public Key */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground">Public Key</p>
        <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 font-mono text-xs">
          <span className="flex-1 truncate">
            {visible ? publicKey : "********************"}
          </span>

          <span onClick={() => setVisible(!visible)}>
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-muted-foreground">Secret Key</p>
        <div className="rounded-md border bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          ******************** (visível apenas uma vez)
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Criada em</span>
        <span>{createdAt.toLocaleDateString("pt")}</span>
      </div>
    </div>
  );
}
