import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold relative overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 after:absolute after:inset-0 after:z-[-1] after:transition-all after:duration-300 hover:after:opacity-100 after:opacity-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground after:bg-gradient-to-r after:from-primary/40 after:via-primary after:to-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:scale-105",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground after:bg-gradient-to-r after:from-secondary/40 after:via-secondary after:to-secondary/40 hover:shadow-[0_0_20px_rgba(var(--secondary),0.4)] hover:scale-105",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground after:bg-gradient-to-r after:from-destructive/40 after:via-destructive after:to-destructive/40 hover:shadow-[0_0_20px_rgba(var(--destructive),0.4)] hover:scale-105",
        outline: 
          "text-foreground after:bg-gradient-to-r after:from-muted/0 after:via-muted/50 after:to-muted/0 hover:border-muted/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
