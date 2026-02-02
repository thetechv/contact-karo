import { useState, useEffect } from "react";
import {  type VehicleOwner } from "../constants";
import tagService from "@/fe/services/tagService";

export function useVehicleOwner(id: string) {
  const [vehicleOwner, setVehicleOwner] = useState<VehicleOwner | null>(null);

  useEffect(() => {
    const fetchTag = async () => {
      const tag = await tagService.getTagById(id);
      setVehicleOwner(tag);
    };
    fetchTag();
  }, [id]);

  return vehicleOwner;
}
