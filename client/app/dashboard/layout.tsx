import { UserProvider } from "@/context/UserContext";
import { ReactNode } from "react";

function DashBoard({ children }: { children: ReactNode }) {
  return <UserProvider> {children}</UserProvider>;
}

export default DashBoard;
