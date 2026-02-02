import { useState, useEffect } from "react";
import { type VehicleOwner } from "../constants";
import tagService from "@/fe/services/tagService";

export function useVehicleOwner(id: string) {
  const [loading, setLoading] = useState(true);
  const [vehicleOwner, setVehicleOwner] = useState<VehicleOwner | null>(null);

  useEffect(() => {
    const fetchTag = async () => {
      setLoading(true);
      try {
        const tag = await tagService.getTagById(id);
        setVehicleOwner(tag?.data?.user_id || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTag();
  }, [id]);

  return { isLoading: loading, vehicleOwner };
}
