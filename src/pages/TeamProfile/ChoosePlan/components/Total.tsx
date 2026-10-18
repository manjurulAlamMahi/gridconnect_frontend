import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Result = {
  total: number;
  currency?: string;
  subscription?: {
    name: string;
    price: number;
  };
  promo?: {
    text: string;
  };
};

type Props = {
  result: Result;
  className?: string;
};

export default function TotalSection({ result, className }: Props) {
  const currency = result.currency ?? "GBP";

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return (
    <Card
      className={cn(
        "bg-linear-to-l from-[#020304] via-[#0D090E] to-[#1C0D14] border border-primary/40 rounded-2xl p-6",
        "text-slate-200",
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Total</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-3xl font-normal leading-none">
              {formatter.format(result.total ?? 0)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid gap-2.5">
          {result.subscription ? (
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#99A1AF]">
                {result.subscription.name}
              </div>
              <div className="text-sm text-slate-400">
                {formatter.format(result.subscription.price ?? 0)}
              </div>
            </div>
          ) : (
            []
          )}

          {/* Promo row */}
          {result.promo ? (
            <div className="flex items-center gap-2 text-sm text-green-400 mt-1">
              <span>{result.promo.text}</span>
            </div>
          ) : (
            []
          )}
        </div>
      </CardContent>
    </Card>
  );
}
