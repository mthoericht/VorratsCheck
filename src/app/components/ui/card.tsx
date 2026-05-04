import * as React from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { PaperProps } from "@mui/material";

import { cn } from "./utils";

function Card({ className, ...props }: PaperProps) 
{
  return (
    <Paper
      data-slot="card"
      elevation={0}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-2 border-border",
        className,
      )}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        color: "text.primary",
      }}
      {...props}
    />
  );
}

function CardHeader({ className, style, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Box
      data-slot="card-header"
      className={cn(
        "text-card-foreground @container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 24,
        display: "grid",
        alignItems: "start",
        gap: 6,
        ...style,
      }}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Typography
      component="div"
      variant="subtitle1"
      data-slot="card-title"
      className={cn("leading-none", className)}
      sx={{ lineHeight: 1.25, fontWeight: 600 }}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Typography
      component="p"
      variant="body2"
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      color="text.secondary"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Box
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      sx={{
        gridColumnStart: 2,
        gridRowStart: 1,
        gridRowEnd: "span 2",
        alignSelf: "start",
        justifySelf: "end",
      }}
      {...props}
    />
  );
}

function CardContent({ className, style, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Box
      data-slot="card-content"
      className={cn("px-6 text-card-foreground [&:last-child]:pb-6", className)}
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 24,
        ...style,
      }}
      {...props}
    />
  );
}

function CardFooter({ className, style, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Box
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 24,
        ...style,
      }}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
