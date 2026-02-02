"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { vehicleInfoStyles } from "@/module/home/styles/vehicleStyles";

interface VehicleInfoProps {
  vehicleName: string;
  plateNumber: string;
  maskedDigits: string;
}

export const VehicleInfo: React.FC<VehicleInfoProps> = ({
  vehicleName,
  plateNumber,
  maskedDigits,
}) => {
  const s = vehicleInfoStyles;

  return (
    <div className={s.container}>
      <h1 className={s.title}>Contact Vehicle Owner.</h1>

      <div className={s.plateContainer}>
        <div className={s.plateWrapper}>
          <span className={s.plateIcon}>🔵</span>
          <span className={s.plateNumber}>{plateNumber}</span>
        </div>
      </div>

      <p className={s.description}>
        Please select a reason why do you want to contact the owner.
      </p>
    </div>
  );
};
