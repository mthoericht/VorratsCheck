import * as React from "react";
import { styled } from "@mui/material/styles";

import { cn } from "./utils";

const StyledInput = styled("input")(({ theme }) => ({
  width: "100%",
  minWidth: 0,
  height: 36,
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}`,
  padding: "6px 12px",
  fontSize: 14,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  outline: "none",
  transition: "border-color 150ms, box-shadow 150ms",
  "&::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  "&:focus": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.main}22`,
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
}));

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(function Input(
  { className, type, ...props },
  ref,
) 
{
  return (
    <StyledInput
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
});

export { Input };
