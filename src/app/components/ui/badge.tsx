import * as React from "react";
import { Box } from "@mui/material";

import { cn } from "./utils";

const BADGE_BASE_CLASSES = "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden";
const BADGE_VARIANT_CLASSES = {
  default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
  secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
  destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
} as const;

type BadgeVariant = keyof typeof BADGE_VARIANT_CLASSES;

function badgeVariants({ variant = "default" }: { variant?: BadgeVariant })
{
  return cn(BADGE_BASE_CLASSES, BADGE_VARIANT_CLASSES[variant]);
}

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"span">, "children"> &
  { variant?: BadgeVariant; asChild?: boolean; children?: React.ReactNode }) 
{
  const variantStyles = {
    default: {
      bgcolor: "primary.main",
      color: "primary.contrastText",
      borderColor: "primary.main",
    },
    secondary: {
      bgcolor: "secondary.main",
      color: "secondary.contrastText",
      borderColor: "secondary.main",
    },
    destructive: {
      bgcolor: "error.main",
      color: "error.contrastText",
      borderColor: "error.main",
    },
    outline: {
      bgcolor: "transparent",
      color: "text.primary",
      borderColor: "divider",
    },
  } as const;
  const resolvedVariant = variant ?? "default";

  if (asChild && React.isValidElement(props.children))
  {
    return React.cloneElement(props.children, {
      "data-slot": "badge",
      className: cn((props.children.props as { className?: string }).className, badgeVariants({ variant }), className),
    });
  }

  return (
    <Box
      component="span"
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        borderRadius: 1,
        border: "1px solid",
        px: 1,
        py: 0.25,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.2,
        ...variantStyles[resolvedVariant],
      }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
