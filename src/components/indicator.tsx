import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface IndicatorProps {
  title: string;
  icon: ReactNode;
  mainContent: string;
  subContent: string;
}

export default function Indicator({
  title,
  icon,
  mainContent,
  subContent,
}: IndicatorProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="-mb-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-medium">{mainContent}</div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{subContent}</p>
      </CardFooter>
    </Card>
  );
}
