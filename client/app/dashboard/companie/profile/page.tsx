"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import TenantService from "@/services/tenant";
import { Checkbox } from "@/components/ui/checkbox";
import { isArrayMappble } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, setUser } = useUser();

  if (!user) {
    return null;
  }
  const [password, setPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [processing, setProcessing] = useState(false);

  const handleProfileUpdate = async () => {
    if (!user.title || !user.email || !user.phone) {
      toast.info("Preenche os campos");
      return;
    }
    setProcessing(true);
    const token = localStorage.getItem("token") as string;
    const updater = await new TenantService(token).update({
      email: user.email,
      phone: user.phone,
      title: user.title,
    });
    console.log(updater);
    toast.info(updater?.data ? "Perfil actualizado" : updater?.message);
    setProcessing(false);
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.info("Preenche os campos");
      return;
    }
    setProcessing(true);
    const token = localStorage.getItem("token") as string;
    const updater = await new TenantService(token).resetPassword({
      newPassword,
      confirmNewPasword: confirmPassword,
      oldPassword: currentPassword,
    });
    console.log(updater);
    const message = isArrayMappble(updater?.message)
      ? updater?.message[0]
      : updater?.message;
    toast.info(updater?.data ? "Perfil actualizado" : message);
    setProcessing(false);
  };

  return (
    <div className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="border-b mb-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="font-bold uppercase">
                  {user.title.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="text-lg font-semibold">{user.title}</p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={user.title}
                onChange={(e) =>
                  setUser({
                    ...user,
                    title: e.target.value,
                  })
                }
              />

              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
              />
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={user.phone}
                onChange={(e) =>
                  setUser({
                    ...user,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <Button
              disabled={processing}
              className="text-white"
              onClick={handleProfileUpdate}
            >
              {processing ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Atualizar Perfil"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-col">
              <Label htmlFor="password">Sua senha</Label>
              <Input
                type={!password ? "password" : "text"}
                placeholder="Senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                type={!password ? "password" : "text"}
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Label htmlFor="password">Confirma a nova Senha</Label>
              <Input
                type={!password ? "password" : "text"}
                placeholder="Confirmar nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <span
              onClick={() => {
                setPassword((prev) => !prev);
              }}
              className="flex items-center gap-1 text-sm"
            >
              <Checkbox checked={password} />
              Ver senhas
            </span>
            <Button
              disabled={processing}
              className="text-white"
              onClick={handlePasswordUpdate}
            >
              {processing ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Atualizar senha"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
