import * as React from "react";
import { Box, Typography } from "@mui/material";

import { cn } from "./utils";

const ALERT_BASE_CLASSES = "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current";
const ALERT_VARIANT_CLASSES = {
  default: "bg-card text-card-foreground",
  destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
} as const;
type AlertVariant = keyof typeof ALERT_VARIANT_CLASSES;

function alertVariants(variant: AlertVariant = "default")
{
  return cn(ALERT_BASE_CLASSES, ALERT_VARIANT_CLASSES[variant]);
}

function Alert({
  className,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { variant?: AlertVariant }) 
{
  const resolvedVariant = variant ?? "default";
  return (
    <Box
      component="div"
      data-slot="alert"
      role="alert"
      className={cn(alertVariants(variant), className)}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 2,
        border: "1px solid",
        px: 2,
        py: 1.5,
        fontSize: 14,
        bgcolor: "background.paper",
        color: resolvedVariant === "destructive" ? "error.main" : "text.primary",
        borderColor: resolvedVariant === "destructive" ? "error.main" : "divider",
      }}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Typography
      component="div"
      variant="subtitle2"
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      sx={{ fontWeight: 600, letterSpacing: "0.01em" }}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Typography
      component="div"
      variant="body2"
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      color="text.secondary"
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
