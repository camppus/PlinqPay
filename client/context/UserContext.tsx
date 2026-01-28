"use client";
import Loader from "@/components/Loader";
import TenantService from "@/services/tenant";
import { ITenant } from "@/types";
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
        setIsLOading(false);
      }
    }
    get();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {isLoading ? <Loader /> : <> {children}</>}
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
