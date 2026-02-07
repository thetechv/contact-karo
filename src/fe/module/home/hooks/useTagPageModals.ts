import { useState } from "react";

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
