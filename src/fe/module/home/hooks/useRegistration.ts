interface UseRegistrationProps {
  onSuccess?: () => void;
}

export function useRegistration({ onSuccess }: UseRegistrationProps = {}) {
  const handleRegistrationSuccess = () => {
    // Refresh vehicle owner data after successful registration
    onSuccess?.();
  };

  return {
    handleRegistrationSuccess,
  };
}
