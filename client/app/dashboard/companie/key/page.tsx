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
import { FolderRoot, KeyIcon, Loader2, Plus } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";
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
import ApiKeyService from "@/services/keys";
import Loader from "@/components/Loader";
import constants from "@/constants";
import { toast } from "sonner";
export default function Key() {
  const [keys, setKeys] = useState<IApiSecretKey[]>(apiKeysMock);
  const [laod, setLoad] = useState(true);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    async function get() {
      const token = localStorage.getItem("token") as string;
      const data = await new ApiKeyService(token).getAlls(1);
      setKeys(data);
      setTimeout(() => {
        setLoad(false);
      }, constants.TIMEOUT_LOADER);
    }

    get();
  }, []);

  return (
    <section className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      {laod ? (
        <Loader />
      ) : (
        <>
          <span className=" flex items-center justify-between">
            <h1 className="text-xl font-semibold">Minhas chaves</h1>
            <Button
              onClick={() => {
                setOpen(true);
              }}
              className="text-white"
            >
              <Plus />
              Nova
            </Button>
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
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    className="text-white"
                  >
                    <Plus />
                    Nova
                  </Button>
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
        </>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="z-">
          <SheetHeader>
            <SheetTitle>Adicionar chave</SheetTitle>
            <SheetDescription>
              Mantenha a chave secreta e a privada armazenda de forma segura em
              seu computador ou servidor
            </SheetDescription>
          </SheetHeader>
          <form action="" className="flex flex-col gap-3 px-4">
            <label htmlFor="">Título</label>
            <InputGroup>
              <InputGroupInput
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Título"
                value={title}
              />
              <InputGroupAddon>
                <KeyIcon />
              </InputGroupAddon>
            </InputGroup>
            <Button
              disabled={processing}
              onClick={async () => {
                if (!title) {
                  toast.info("Preenche o titulo");
                  return;
                }
                setProcessing(true);

                const token = localStorage.getItem("token") as string;
                const data = await new ApiKeyService(token).create({
                  title,
                });

                const message = isArrayMappble(data?.message)
                  ? data?.message[0]
                  : data?.message;

                toast.info(data?.data ? "Chave criada" : message);
                console.log(data?.data);
                setProcessing(false);
                if (data?.data) {
                  setKeys((prev) => [data?.data, ...prev]);
                }
              }}
              type="button"
              className="text-white"
            >
              {processing ? <Loader2 className="animate-spin" /> : "Adidionar"}
            </Button>

            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950">
              <p className="text-sm text-red-900 dark:text-red-200">
                💡 <strong>IMPORTANTE :</strong> Após a criação cerfique-se de
                copiar a chave secreta da chave que criaste , pois o mesmo so é
                visivel uma única vez
              </p>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </section>
  );
}
