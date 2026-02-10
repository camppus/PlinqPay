import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Istats } from "@/types";

export default function Stats({ data }: { data: Istats }) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{data.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {Number(data.amount).toLocaleString("pt")}
          {data.isCoin && "kz"}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {data.subtitle} <IconTrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">{data.description}</div>
      </CardFooter>
    </Card>
  );
}
