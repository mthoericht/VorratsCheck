"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";

import { cn } from "./utils";

type SelectRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
};

type SelectTriggerProps = Omit<React.ComponentProps<"select">, "children" | "size"> & {
  size?: "sm" | "default";
  children?: React.ReactNode;
  __selectValue?: string;
  __selectDefaultValue?: string;
  __onValueChange?: (value: string) => void;
  __disabled?: boolean;
  __required?: boolean;
  __name?: string;
  __items?: React.ReactNode;
};

const StyledSelect = styled("select")(({ theme }) => ({
  width: "100%",
  borderRadius: 6,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontSize: 14,
  padding: "6px 12px",
  outline: "none",
  transition: "border-color 150ms, box-shadow 150ms",
  "&[data-size='default']": {
    height: 36,
  },
  "&[data-size='sm']": {
    height: 32,
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

function Select({
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  required,
  children,
}: SelectRootProps) 
{
  const childArray = React.Children.toArray(children);

  const trigger = childArray.find((child) => React.isValidElement(child) && child.type === SelectTrigger) as
    | React.ReactElement<SelectTriggerProps>
    | undefined;
  const content = childArray.find((child) => React.isValidElement(child) && child.type === SelectContent) as
    | React.ReactElement<{ children?: React.ReactNode }>
    | undefined;
  const renderedTrigger = trigger
    ? React.cloneElement(trigger, {
      __selectValue: value,
      __selectDefaultValue: defaultValue,
      __onValueChange: onValueChange,
      __disabled: disabled,
      __required: required,
      __name: name,
      __items: content?.props.children,
    })
    : null;

  return (
    <div data-slot="select">
      {renderedTrigger}
    </div>
  );
}

function SelectGroup({
  children,
}: React.ComponentProps<"div">) 
{
  return <>{children}</>;
}

function SelectValue({
  children,
}: { placeholder?: React.ReactNode; children?: React.ReactNode }) 
{
  return <>{children}</>;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  __selectValue,
  __selectDefaultValue,
  __onValueChange,
  __disabled,
  __required,
  __name,
  __items,
  ...props
}: SelectTriggerProps) 
{
  const [uncontrolledValue, setUncontrolledValue] = React.useState(__selectDefaultValue ?? "");
  const isControlled = __selectValue !== undefined;
  const currentValue = isControlled ? __selectValue : uncontrolledValue;

  const placeholder = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SelectValue,
  ) as React.ReactElement<{ placeholder?: React.ReactNode }> | undefined;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
  {
    const nextValue = event.target.value;
    if (!isControlled)
    {
      setUncontrolledValue(nextValue);
    }
    __onValueChange?.(nextValue);
  };

  return (
    <StyledSelect
      value={currentValue}
      onChange={handleChange}
      disabled={__disabled}
      required={__required}
      name={__name}
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8",
        className,
      )}
      {...props}
    >
      {placeholder?.props.placeholder ? (
        <option value="" disabled hidden>
          {placeholder.props.placeholder}
        </option>
      ) : null}
      {renderSelectItems(__items)}
    </StyledSelect>
  );
}

function SelectContent({
  children,
}: React.ComponentProps<"div">) 
{
  return <>{children}</>;
}

function SelectLabel({
  children,
  ...props
}: React.ComponentProps<"div">) 
{
  return <div data-slot="select-label" {...props}>{children}</div>;
}

function SelectItem({
  children,
  value,
  ...props
}: React.ComponentProps<"div"> & { value: string }) 
{
  return <div data-slot="select-item" data-value={value} {...props}>{children}</div>;
}

function SelectSeparator({
  ...props
}: React.ComponentProps<"div">) 
{
  return <div data-slot="select-separator" {...props} />;
}

function SelectScrollUpButton({
  ...props
}: React.ComponentProps<"div">) 
{
  return <div data-slot="select-scroll-up-button" {...props} />;
}

function SelectScrollDownButton({
  ...props
}: React.ComponentProps<"div">) 
{
  return <div data-slot="select-scroll-down-button" {...props} />;
}

function renderSelectItems(nodes: React.ReactNode): React.ReactNode
{
  return React.Children.toArray(nodes).flatMap((child, index) =>
  {
    if (!React.isValidElement(child))
    {
      return [];
    }

    if (child.type === SelectItem)
    {
      const props = child.props as { value: string; children?: React.ReactNode; disabled?: boolean };
      return <option key={`${props.value}-${index}`} value={props.value} disabled={props.disabled}>{flattenText(props.children)}</option>;
    }

    if (child.type === SelectLabel)
    {
      return [];
    }

    if (child.type === SelectSeparator)
    {
      return [];
    }

    if (child.type === SelectGroup)
    {
      return renderSelectItems((child.props as { children?: React.ReactNode }).children);
    }

    return [];
  });
}

function flattenText(node: React.ReactNode): string
{
  if (typeof node === "string" || typeof node === "number")
  {
    return String(node);
  }

  if (Array.isArray(node))
  {
    return node.map(flattenText).join("");
  }

  if (React.isValidElement(node))
  {
    return flattenText((node.props as { children?: React.ReactNode }).children);
  }

  return "";
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
