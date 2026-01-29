"use client";
import { TransacttionDetails } from "@/components/Transactions";
import { useParams } from "next/navigation";

export default function TransactionDetailsPage() {
  const { id } = useParams();

  return (
    <div className="w-full lg:items-center gap-4 flex flex-col lg:*:w-[50%] *:w-full">
      <TransacttionDetails id={id as string} />
    </div>
  );
}
