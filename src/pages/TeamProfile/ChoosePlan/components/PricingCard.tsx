import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PricingCardProps {
  type?: string;
  title: string;
  price: string;
  period?: string;
  description: string;
  features: { text: string }[];
  popular?: boolean;
  valueText?: string;
  valuePrice?: string;
  variant?: "default" | "premium";
  value: string;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

export function PricingCard({
  type,
  title,
  price,
  description,
  features,
  variant = "default",
  value,
  selectedValue,
  onValueChange,
}: PricingCardProps) {
  const isSelected = selectedValue === value;

  return (
    <Card
      className={cn(
        "relative border rounded-2xl bg-linear-to-b from-neutral-900 to-neutral-950 transition-all cursor-pointer min-h-[400px]",
        isSelected &&
          "border-primary ring-2 ring-primary/20 shadow-b shadow-2xl shadow-primary/40"
      )}
      onClick={() => onValueChange?.(value)}
    >
      {type ? (
        <Badge
          className={`absolute -top-3 left-20 -translate-x-1/2 bg-primary text-white text-xs! px-4 py-1 ${
            type === "Best Value" ? "bg-primary" : "bg-[#00C950]"
          }`}
        >
          {type}
        </Badge>
      ) : null}
      <CardHeader className="pb-4">
        <div className="text-start">
          <h3
            className={cn(
              "text-xl font-bold mb-2",
              variant === "premium" ? "text-primary" : "text-white"
            )}
          >
            {title}
          </h3>
          <div className="flex items-baseline justify-start gap-1 mb-1">
            <span className="text-3xl font-bold text-white">{price}</span>
            {variant === "default" && (
              <span className="text-accent/60 text-sm">(Until Jan 2026)</span>
            )}
          </div>
          <p className="text-accent/60 text-sm">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-neutral-300 text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Radio Button with Red Checkmark */}
        <div className="flex items-center gap-4 mt-6">
          <RadioGroup
            key={selectedValue}
            value={selectedValue}
            onValueChange={onValueChange}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value={value}
                id={value}
                className="h-6 w-6 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors relative"
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white font-bold" />
                  </div>
                )}
              </RadioGroupItem>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
