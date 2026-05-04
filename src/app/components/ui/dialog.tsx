"use client";

import * as React from "react";
import { Box, Dialog as MuiDialog, IconButton, Typography } from "@mui/material";
import { XIcon } from "@/app/lib/icons";

import { cn } from "./utils";
import { translate } from "@/app/lib/i18n";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext()
{
  const context = React.useContext(DialogContext);
  if (!context)
  {
    throw new Error("Dialog components must be used within <Dialog>.");
  }
  return context;
}

function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) 
{
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(Boolean(defaultOpen));
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) =>
    {
      if (!isControlled)
      {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open: currentOpen, setOpen }}>
      <div data-slot="dialog" {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  asChild,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) 
{
  const { setOpen } = useDialogContext();
  const invokeClick = (handler: ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined, event: React.MouseEvent) =>
  {
    handler?.(event as React.MouseEvent<HTMLButtonElement>);
  };

  if (asChild && React.isValidElement(children))
  {
    return React.cloneElement(children, {
      "data-slot": "dialog-trigger",
      onClick: (event: React.MouseEvent) =>
      {
        invokeClick((children.props as { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }).onClick, event);
        invokeClick(onClick, event);
        setOpen(true);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={(event) =>
      {
        onClick?.(event);
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogPortal({
  children,
  ...props
}: React.ComponentProps<"div">) 
{
  return (
    <div data-slot="dialog-portal" {...props}>
      {children}
    </div>
  );
}

function DialogClose({
  asChild,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) 
{
  const { setOpen } = useDialogContext();
  const invokeClick = (handler: ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined, event: React.MouseEvent) =>
  {
    handler?.(event as React.MouseEvent<HTMLButtonElement>);
  };

  if (asChild && React.isValidElement(children))
  {
    return React.cloneElement(children, {
      "data-slot": "dialog-close",
      onClick: (event: React.MouseEvent) =>
      {
        invokeClick((children.props as { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }).onClick, event);
        invokeClick(onClick, event);
        setOpen(false);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="dialog-close"
      onClick={(event) =>
      {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogOverlay() 
{
  return null;
}

function DialogContent({
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { "aria-label"?: string }) 
{
  const { open, setOpen } = useDialogContext();

  return (
    <DialogPortal data-slot="dialog-portal">
      <MuiDialog
        open={open}
        onClose={() => setOpen(false)}
        disablePortal
        aria-labelledby={undefined}
        aria-label={ariaLabel ?? "Dialog"}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            className: cn("rounded-lg border shadow-lg", className),
            sx: {
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: 8,
              bgcolor: "background.paper",
            },
          },
        }}
      >
        <Box
          data-slot="dialog-content"
          className="bg-background relative grid gap-4 p-6"
          sx={{
            position: "relative",
            display: "grid",
            gap: 2,
            p: 3,
          }}
          {...props}
        >
          {children}
          <IconButton
            aria-label={translate("common.close")}
            onClick={() => setOpen(false)}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 1,
            }}
          >
            <XIcon />
          </IconButton>
        </Box>
      </MuiDialog>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Box
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      sx={{ display: "flex", flexDirection: "column", gap: 1, textAlign: "left" }}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) 
{
  return (
    <Box
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1, justifyContent: "flex-end" }}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h2">) 
{
  return (
    <Typography
      component="h2"
      variant="h6"
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      sx={{ lineHeight: 1.2, fontWeight: 600 }}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) 
{
  return (
    <Typography
      component="p"
      variant="body2"
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      color="text.secondary"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
