import * as React from "react"
import { cn } from "@/lib/utils"

type ScrollAreaProps = React.ComponentProps<"div">

const ScrollArea = ({ className, ...props }: ScrollAreaProps) => {
  return (
    <div
      className={cn("relative overflow-y-auto", className)}
      {...props}
    />
  )
}

export { ScrollArea }
