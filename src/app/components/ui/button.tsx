import * as React from "react";
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import { cn } from "./utils";

const BUTTON_BASE_CLASSES = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0";
const BUTTON_VARIANT_CLASSES = {
  default: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border bg-background text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "bg-transparent text-foreground",
  link: "bg-transparent text-primary underline underline-offset-4",
} as const;
const BUTTON_SIZE_CLASSES = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-10 px-6 text-base",
  icon: "size-9 rounded-md",
} as const;

type ButtonVariant = keyof typeof BUTTON_VARIANT_CLASSES;
type ButtonSize = keyof typeof BUTTON_SIZE_CLASSES;

type ButtonProps = Omit<React.ComponentProps<"button">, "color"> &
  {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
    sx?: SxProps<Theme>;
  };

function mergeChildClassName(child: React.ReactElement, className: string)
{
  const currentClassName = (child.props as { className?: string }).className;
  return cn(currentClassName, className);
}

function buttonVariants({ variant = "default", size = "default", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string })
{
  return cn(BUTTON_BASE_CLASSES, BUTTON_VARIANT_CLASSES[variant], BUTTON_SIZE_CLASSES[size], className);
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button({ className, variant = "default", size = "default", asChild = false, sx, ...props }, ref) 
{
  const resolvedVariant: ButtonVariant = variant ?? "default";
  const resolvedSize: ButtonSize = size ?? "default";

  const muiVariant: MuiButtonProps["variant"] = resolvedVariant === "default" || resolvedVariant === "destructive" || resolvedVariant === "secondary"
    ? "contained"
    : "text";
  const muiColor: MuiButtonProps["color"] = resolvedVariant === "destructive"
    ? "error"
    : resolvedVariant === "secondary"
      ? "secondary"
      : "primary";
  const muiSize: MuiButtonProps["size"] = resolvedSize === "sm" ? "small" : resolvedSize === "lg" ? "large" : "medium";

  if (asChild)
  {
    const { children, ...restProps } = props;
    if (React.isValidElement(children))
    {
      return React.cloneElement(children, {
        "data-slot": "button",
        className: mergeChildClassName(children, cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize, className }))),
        ...restProps,
        ...(sx ? { sx } : {}),
      });
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize, className }))}
        {...props}
      />
    );
  }

  return (
    <MuiButton
      ref={ref}
      data-slot="button"
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      className={cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize }), resolvedSize === "icon" ? "p-0" : undefined, className)}
      sx={[
        {
          ...(resolvedSize === "icon" ? { minWidth: 36, width: 36, height: 36 } : {}),
          ...(resolvedVariant === "outline" ? { border: "1px solid", borderColor: "divider" } : {}),
          ...(resolvedVariant === "link"
            ? {
              p: 0,
              minWidth: "auto",
              textDecoration: "underline",
              textUnderlineOffset: "0.25em",
              "&:hover": { textDecoration: "underline" },
            }
            : {}),
        },
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
      {...props}
    />
  );
});

export { Button, buttonVariants };
