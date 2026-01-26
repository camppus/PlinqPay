import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full min-h-[50dvh] flex justify-center items-center">
      <Loader2 className=" animate-spin text-blue-500" />
    </div>
  );
}
