"use client";

import React from "react";
import { reasonSelectorStyles } from "@/module/home/styles/reasonStyles";

interface ReasonOption {
  id: string;
  icon: string;
  label: string;
  highlighted?: boolean;
}

interface ReasonSelectorProps {
  options: ReasonOption[];
  selectedReason: string | null;
  onSelect: (id: string) => void;
}

export const ReasonSelector: React.FC<ReasonSelectorProps> = ({
  options,
  selectedReason,
  onSelect,
}) => {
  const { container, button, radio, icon, label } = reasonSelectorStyles;

  return (
    <div className={container}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`${button.base} ${
            selectedReason === option.id ? button.selected : button.default
          }`}
        >
          <div className={radio.container}>
            {selectedReason === option.id && <div className={radio.selected} />}
          </div>

          <span className={icon}>{option.icon}</span>

          <span className={label}>{option.label}</span>
        </button>
      ))}
    </div>
  );
};
