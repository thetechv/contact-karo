import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import tagService from "@/fe/services/tagService";
import { VehicleOwner } from "./vehicleService";

// Tag ID hook service
export function useTagId() {
  const params = useParams();
  const idParam = params?.id;

  const id = Array.isArray(idParam)
    ? (idParam[0] ?? "")
    : ((idParam as string | undefined) ?? "");

  return { id };
}

// Tag page modals hook service
export function useTagPageModals() {
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openOwnerLoginModal = () => setIsOwnerLoginModalOpen(true);
  const closeOwnerLoginModal = () => setIsOwnerLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  return {
    // Owner login modal state
    isOwnerLoginModalOpen,
    openOwnerLoginModal,
    closeOwnerLoginModal,

    // Register modal state
    isRegisterModalOpen,
    openRegisterModal,
    closeRegisterModal,
  };
}

// Reason selector hook service
export function useReasonSelector(defaultReason: string = "no-parking") {
  const [selectedReason, setSelectedReason] = useState<string | null>(
    defaultReason,
  );

  return {
    selectedReason,
    setSelectedReason,
  };
}

// Vehicle owner hook service
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
          const owner = response.data.user_id;

          if (owner) {
            setVehicleOwner({
              ...owner,
              vehicle_type: response.data.type,
            });
          } else {
            setVehicleOwner(null);
          }
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
