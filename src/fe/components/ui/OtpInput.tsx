"use client";

import React, { useRef, useState, useEffect, KeyboardEvent } from "react";
import { cn } from "@/fe/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  useEffect(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    setOtp(arr);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;

    // Only allow digits
    const digit = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newOtp = pastedData.split("").slice(0, length);
    while (newOtp.length < length) newOtp.push("");
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-yellow-400",
            "bg-white dark:bg-gray-900",
            error
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-700",
            disabled && "opacity-50 cursor-not-allowed",
            "text-gray-900 dark:text-gray-100",
          )}
        />
      ))}
    </div>
  );
};
