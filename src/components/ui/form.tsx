"use client";

import * as React from "react";
import { useFormContext, Controller, FieldValues, Path, FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Select } from "./select";
import { Checkbox } from "./checkbox";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  children: (field: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: FieldError;
  }) => React.ReactNode;
}

export function FormField<T extends FieldValues>({ name, children }: FormFieldProps<T>) {
  const { control, formState: { errors } } = useFormContext<T>();
  const error = errors[name] as FieldError | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => children({ ...field, error })}
    />
  );
}

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

export function FormItem({ children, className }: FormItemProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

interface FormLabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function FormLabel({ children, className, htmlFor }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
    </label>
  );
}

interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

export function FormControl({ children, className }: FormControlProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface FormMessageProps {
  children?: React.ReactNode;
  className?: string;
}

export function FormMessage({ children, className }: FormMessageProps) {
  if (!children) return null;
  
  return (
    <p className={cn("text-sm font-medium text-destructive", className)}>
      {children}
    </p>
  );
}

// Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
}

export function FormInput({ name, label, className, ...props }: FormInputProps) {
  return (
    <FormField name={name}>
      {({ value, onChange, onBlur, error }) => (
        <FormItem>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <FormControl>
            <Input
              id={name}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              className={cn(error && "border-destructive", className)}
              {...props}
            />
          </FormControl>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    </FormField>
  );
}

// Form Select Component
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
}

export function FormSelect({ name, label, options, className, ...props }: FormSelectProps) {
  return (
    <FormField name={name}>
      {({ value, onChange, onBlur, error }) => (
        <FormItem>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <FormControl>
            <Select
              id={name}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              className={cn(error && "border-destructive", className)}
              {...props}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    </FormField>
  );
}

// Form Checkbox Component
interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
}

export function FormCheckbox({ name, label, className, ...props }: FormCheckboxProps) {
  return (
    <FormField name={name}>
      {({ value, onChange, onBlur, error }) => (
        <FormItem>
          <div className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                id={name}
                checked={value || false}
                onCheckedChange={onChange}
                onBlur={onBlur}
                className={cn(error && "border-destructive", className)}
                {...props}
              />
            </FormControl>
            {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          </div>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    </FormField>
  );
}
