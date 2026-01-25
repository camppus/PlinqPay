"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FolderRoot, KeyIcon, Plus } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";
import { IApiSecretKey } from "@/types";
import { apiKeysMock } from "@/constants/mocks/keys";
import { isArrayMappble } from "@/lib/utils";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty";
import { ApiKeyCard } from "@/components/ApiSecret";

export default function Key() {
  const [keys, setKeys] = useState<IApiSecretKey[]>(apiKeysMock);

  return (
    <section className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      <span className=" flex items-center justify-between">
        <h1 className="text-xl font-semibold">Minhas chaves</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="text-white">
              <Plus />
              Nova
            </Button>
          </SheetTrigger>
          <SheetContent className="z-">
            <SheetHeader>
              <SheetTitle>Adicionar chave</SheetTitle>
              <SheetDescription>
                Mantenha a chave secreta e a privada armazenda de forma segura
                em seu computador ou servidor
              </SheetDescription>
            </SheetHeader>
            <form action="" className="flex flex-col gap-3 px-4">
              <label htmlFor="">Título</label>
              <InputGroup>
                <InputGroupInput placeholder="Título" />
                <InputGroupAddon>
                  <KeyIcon />
                </InputGroupAddon>
              </InputGroup>
              <Button>Adidionar</Button>
            </form>
          </SheetContent>
        </Sheet>
      </span>

      <div>
        {!isArrayMappble(keys) ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderRoot />
              </EmptyMedia>
              <EmptyTitle>Sem Chaves</EmptyTitle>
              <EmptyDescription>
                Crie uma chave agora e comece a facturar
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="text-white">
                    <Plus />
                    Nova chave
                  </Button>
                </SheetTrigger>
                <SheetContent className="z-">
                  <SheetHeader>
                    <SheetTitle>Adicionar chave</SheetTitle>
                    <SheetDescription>
                      Mantenha a chave secreta e a privada armazenda de forma
                      segura em seu computador ou servidor
                    </SheetDescription>
                  </SheetHeader>
                  <form action="" className="flex flex-col gap-3 px-4">
                    <label htmlFor="">Título</label>
                    <InputGroup>
                      <InputGroupInput placeholder="Título" />
                      <InputGroupAddon>
                        <KeyIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    <Button>Adidionar</Button>
                  </form>
                </SheetContent>
              </Sheet>
            </EmptyContent>
          </Empty>
        ) : (
          <span className="flex flex-col gap-4 mt-6">
            {keys.map((item, idx) => (
              <ApiKeyCard data={item} key={idx} />
            ))}
          </span>
        )}
      </div>
    </section>
  );
}
