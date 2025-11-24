import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <Card className="p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && (
            <p
              className={`mt-2 text-sm font-medium ${
                trendUp ? "text-success" : "text-destructive"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-accent/10 p-3">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </div>
    </Card>
  );
};
