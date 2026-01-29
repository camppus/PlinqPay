"use client";
import Loader from "@/components/Loader";
import Logo from "@/components/Logo";
import constants from "@/constants";
import TenantService from "@/services/tenant";
import { ITenant } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UserContextType {
  user: ITenant | null;
  setUser: (user: ITenant | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ITenant | null>(null);
  const router = useRouter();
  const [isLoading, setIsLOading] = useState(true);
  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    const service = new TenantService(token);
    async function get() {
      const me = await service.getMe();
      if (me?.data) {
        setUser(me?.data);
        setTimeout(() => {
          setIsLOading(false);
        }, 2000);
        return;
      }
      router.push("/auth");
    }
    get();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {isLoading ? (
        <div className="flex  justify-center items-center h-screen flex-col gap-2">
          <div className="animate-pulse scale-150">
            <Logo />
          </div>
          <p className="text-xs">From @fckdir</p>
        </div>
      ) : (
        <> {children}</>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de UserProvider");
  }
  return context;
};
