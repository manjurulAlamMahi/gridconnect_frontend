import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Link } from "react-router";

type AccountCardProps = {
  title: string;
  subtitle: string;
  bullets: string[];
  href: string;
  icon: React.ReactNode;
  cta: string;
};

const AccountCard: React.FC<AccountCardProps> = ({
  title,
  subtitle,
  bullets,
  href,
  icon,
  cta,
}) => {
  return (
    <Card className="relative w-full max-w-md bg-[#0B0E12]/60 border border-slate-800/60 rounded-2xl backdrop-blur-md shadow-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-red-900/20">
      <CardHeader className="px-6 pt-6">
        <div className="flex items-center gap-4">
          <div className="flex-none w-16 h-16 rounded-lg bg-linear-to-br from-primary to-red-800/80 p-3 shadow-md flex items-center justify-center">
            {icon}
          </div>
          <div className="text-left">
            <CardTitle className="text-white text-lg font-semibold">
              {title}
            </CardTitle>
            <CardDescription className="text-accent/70 text-sm mt-1 leading-relaxed">
              {subtitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pt-4">
        <ul className="space-y-3 text-accent/70 text-sm">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-6">
        <Link to={href} className="w-full">
          <Button className="w-full py-5 justify-center font-semibold bg-linear-to-b from-primary via-primary to-red-900 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-pointer">
            <span className="mr-2">{cta}</span>
            <MoveRight className="w-5 h-5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
