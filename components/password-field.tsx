"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PasswordField({
  id,
  placeholder,
  value,
  onChange,
  disabled,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Password
      </Label>
      <Input
        id={id}
        type="password"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
