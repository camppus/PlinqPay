"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao@example.com",
    phone: "+244 923 456 789",
  });
  const [password, setPassword] = useState("");
  const [kycFront, setKycFront] = useState<File | null>(null);
  const [kycBack, setKycBack] = useState<File | null>(null);

  const handleProfileUpdate = () => {
    alert(`Perfil atualizado: ${JSON.stringify(profile)}`);
  };

  const handlePasswordUpdate = () => {
    alert(`Senha alterada para: ${password}`);
  };

  const handleKycSubmit = () => {
    if (!kycFront || !kycBack) return alert("Envie ambos os documentos");
    alert(
      `KYC enviado com sucesso! Front: ${kycFront.name}, Back: ${kycBack.name}`,
    );
  };

  return (
    <div className="flx flex-col gap-4 px-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="border-b mb-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="kyc" disabled>
            KYC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="font-bold uppercase">
                  JS
                </AvatarFallback>
              </Avatar>
              <p className="text-lg font-semibold">{profile.name}</p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <Button onClick={handleProfileUpdate}>Atualizar Perfil</Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-col">
              <Label htmlFor="password">Sua senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Label htmlFor="password">Confirma a nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handlePasswordUpdate}>Alterar Senha</Button>
          </div>
        </TabsContent>

        <TabsContent value="kyc">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Envie as imagens do seu documento de identificação (frente e
              verso)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Label htmlFor="kycFront">Documento Frente</Label>
              <Input
                id="kycFront"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setKycFront(e.target.files ? e.target.files[0] : null)
                }
              />
              {kycFront && <p className="text-xs mt-1">{kycFront.name}</p>}

              <Label htmlFor="kycBack">Documento Verso</Label>
              <Input
                id="kycBack"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setKycBack(e.target.files ? e.target.files[0] : null)
                }
              />
              {kycBack && <p className="text-xs mt-1">{kycBack.name}</p>}
            </div>
            <Button onClick={handleKycSubmit}>Enviar KYC</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
