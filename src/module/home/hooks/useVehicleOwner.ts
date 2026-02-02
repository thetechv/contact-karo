import { useState, useEffect } from "react";
import { getRandomVehicleOwner, type VehicleOwner } from "../constants";

export function useVehicleOwner() {
  const [vehicleOwner, setVehicleOwner] = useState<VehicleOwner | null>(null);

  useEffect(() => {
    const owner = getRandomVehicleOwner();
    setVehicleOwner(owner);
  }, []);

  return vehicleOwner;
}
