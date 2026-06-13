import * as React from "react"
import { cn } from "@/lib/utils"

// Skeleton component that provides a simple loading placeholder with an animated pulse effect, which can be used throughout the application to indicate loading states for various UI elements such as cards, charts, and lists, while maintaining a consistent design with the application's theme
const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "animate-pulse rounded-md bg-muted",
      className
    )}
    {...props}
  />
))
Skeleton.displayName = "Skeleton"

export { Skeleton }
