"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Eye,
  EyeClosed,
  Loader2,
  Lock,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Login() {
  const service = new AuthService();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [processing, setProcesing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  async function submitAction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const title = formData.get("title") as string;
    const phone = formData.get("phone") as string;
    if (!email || !password || !phone || !title) {
      toast.error("Preenche todos os campos");
      return;
    }
    setProcesing(true);
    const responseAPi = await service.signIng({
      email,
      password,
      phone,
      title,
    });
    toast.info(responseAPi.message);
    const user = responseAPi?.user;
    if (user) {
      router.push(`/dashboard/companie`);
      localStorage.setItem("token", responseAPi.token);
    }
    setProcesing(false);
  }

  return (
    <form onSubmit={submitAction} className=" flex-col  flex  items-center">
      <span className="flex flex-col gap-2 lg:mt-30 lg:w-[60%] w-full">
        <h1 className="scroll-m-20  lg:text-4xl text-3xl font-semibold lg:w-[80%]  tracking-tight text-balance">
          Crie a sua conta
        </h1>
        <p className="opacity-50">
          Prencha os campos a baixo para que possas acessar a sua conta
        </p>
        <span className="flex flex-col gap-3 my-4">
          <label htmlFor="title">Nome</label>
          <InputGroup>
            <InputGroupInput
              type="text"
              required
              id="title"
              name="title"
              placeholder="seu nome"
            />
            <InputGroupAddon>
              <Users />
            </InputGroupAddon>
          </InputGroup>
          <label htmlFor="phone">Telefone</label>
          <InputGroup>
            <InputGroupInput
              required
              id="phone"
              name="phone"
              placeholder="telefone"
              type="tel"
            />
            <InputGroupAddon>
              <Phone />
            </InputGroupAddon>
          </InputGroup>
          <label htmlFor="emal">Email</label>
          <InputGroup>
            <InputGroupInput
              name="email"
              placeholder="Seu email"
              type="email"
              required
              id="email"
            />
            <InputGroupAddon>
              <Mail />
            </InputGroupAddon>
          </InputGroup>
          <label htmlFor="password">Senha</label>
          <InputGroup>
            <InputGroupInput
              name="password"
              placeholder="***********"
              type={showPass ? "password" : "text"}
              required
              id="password"
            />
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
            <InputGroupAddon
              align={"inline-end"}
              onClick={() => {
                setShowPass((prev) => !prev);
              }}
            >
              {showPass ? <EyeClosed /> : <Eye />}
            </InputGroupAddon>
          </InputGroup>
        </span>
        <span className="flex text-sm mb-3 items-center gap-2">
          <Checkbox />
          <p>Salvar a sessão</p>
        </span>
        <Button disabled={processing} className="text-white">
          {processing ? <Loader2 className="animate-spin" /> : "Criar conta"}
        </Button>

        <a href="/auth" className="text-center mt-3 text-sm">
          Já tens uma conta?{" "}
          <span className="text-blue-500 font-semibold">Acessar</span>{" "}
        </a>
        <span className="flex items-center gap-4 mt-5">
          <div className="flex-1 border-t"></div>
          <p>Ou</p>
          <div className="flex-1 border-t"></div>
        </span>
        <span className="grid md:grid-cols-2 mt-5 gap-5">
          <Button variant={"outline"}>
            <img src="/google.png" className="h-4" />
            Entrar com goggle
          </Button>
          <Button variant={"outline"}>
            <img
              src="/github.png"
              className={clsx("h-4 transition", theme === "dark" && "invert")}
            />
            Entrar com git
          </Button>
        </span>
      </span>
    </form>
  );
}
