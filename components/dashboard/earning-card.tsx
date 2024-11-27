import { Card, CardContent, CardHeader } from "../ui/card";

interface EarningCardProps {
  title: string;
  value: number;
}

export function EarningCard({ title, value }: EarningCardProps) {
  return (
    <Card className="rounded-xl bg-muted-foreground/10">
      <CardHeader>{title}</CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold">${value}</h2>
      </CardContent>
    </Card>
  );
}
