import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex max-w-full items-center justify-center gap-1 whitespace-normal text-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-brand-blue text-white hover:bg-brand-orange",
        purple: "bg-brand-purple text-white hover:bg-brand-orange",
        green: "bg-brand-green text-white hover:bg-brand-purple",
        orange: "bg-brand-orange text-white hover:bg-brand-purple",
        destructive:
          "bg-red-700 text-white hover:bg-red-800",
        outline:
          "border border-gray-500 bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900",
        secondary:
          "border border-gray-500 bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "text-gray-900 hover:bg-gray-100 hover:text-gray-900",
        link: "text-brand-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-4 py-2",
        sm: "min-h-11 rounded-md px-3 py-2",
        lg: "min-h-11 rounded-md px-8 py-2",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
