"use client";

import React from "react";
import { Card } from "@/fe/components/ui/Card";
import { vehicleInfoStyles } from "@/fe/module/home/styles/vehicleStyles";

interface VehicleInfoProps {
  vehicleName: string;
  plateNumber: string;
  vehicleType?: string;
}

export const VehicleInfo: React.FC<VehicleInfoProps> = ({
  vehicleName,
  plateNumber,
  vehicleType,
}) => {
  const s = vehicleInfoStyles;

  // Get appropriate icon based on vehicle type
  const getVehicleIcon = () => {
    const t = (vehicleType || "").toLowerCase();
    switch (t) {
      case "car":
        return "🚗";
      case "bike":
        return "🏍️";
      case "scooter":
        return "🛵";
      case "bag-tag":
        return "🎒";
      case "door-tag":
        return "🚪";
      case "business-card":
        return "📇";
      default:
        return "🚗";
    }
  };

  const getDisplayType = () => {
    if (!vehicleType) return "Vehicle";
    return vehicleType
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Contact {getDisplayType()} Owner</h1>

      <div className={s.plateContainer}>
        <div className={s.plateWrapper}>
          <span className={s.plateIcon}>{getVehicleIcon()}</span>
          <span className={s.plateNumber}>{plateNumber}</span>
        </div>
        {vehicleName && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Owner: {vehicleName}
          </p>
        )}
      </div>

      <p className={s.description}>
        Please select a reason why do you want to contact the owner.
      </p>
    </div>
  );
};
