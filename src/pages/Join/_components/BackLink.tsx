import React from "react";
import { useNavigate, Link } from "react-router";
import { MoveLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BackLinkProps = {
  label?: string;
  to?: string;
  className?: string;
};

const BackLink: React.FC<BackLinkProps> = ({
  label = "Back",
  to,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1);
  };

  const commonClasses = cn(
    "cursor-pointer items-center gap-2 text-accent hover:text-primary duration-300 transition-colors",
    className,
    "hidden md:flex",
  );

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -5 }}
      className="flex items-center gap-2"
    >
      <MoveLeft className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className={commonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={handleBack} className={commonClasses}>
      {content}
    </button>
  );
};

export default BackLink;
