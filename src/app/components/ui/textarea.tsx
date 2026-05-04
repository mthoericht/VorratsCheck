import * as React from "react";
import { styled } from "@mui/material/styles";

import { cn } from "./utils";

const StyledTextarea = styled("textarea")(({ theme }) => ({
  resize: "vertical",
  width: "100%",
  minHeight: 64,
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}`,
  padding: "8px 12px",
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

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) 
{
  return (
    <StyledTextarea
      data-slot="textarea"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
