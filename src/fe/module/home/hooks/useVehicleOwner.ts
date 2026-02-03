import { useState, useEffect } from "react";
import { type VehicleOwner } from "../constants";
import tagService from "@/fe/services/tagService";

export function useVehicleOwner(id: string) {
  const [loading, setLoading] = useState(true);
  const [vehicleOwner, setVehicleOwner] = useState<VehicleOwner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTag = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await tagService.getTagById(id);

        if (response?.success && response?.data) {
          // Set vehicle owner from the populated user_id field
          setVehicleOwner(response.data.user_id || null);
        } else {
          setError(response?.message || "Failed to fetch tag data");
          setVehicleOwner(null);
        }
      } catch (error: any) {
        console.error("Error fetching tag:", error);
        setError(error?.message || "An error occurred while fetching tag data");
        setVehicleOwner(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTag();
    }
  }, [id]);

  return { isLoading: loading, vehicleOwner, error };
}
