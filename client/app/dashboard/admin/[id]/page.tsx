"use client";

import { useParams } from "next/navigation";
import { TransacttionDetails } from "@/components/Transactions";

export default function TransactionDetailsPage() {
  const { id } = useParams();

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <TransacttionDetails id={id as string} />
    </div>
  );
}
