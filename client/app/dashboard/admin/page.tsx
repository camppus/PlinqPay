"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";
import { useEffect, useState } from "react";

export default function Page() {
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {}, []);
  return (
    <section className="flex flex-col gap-5">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </section>
  );
}
