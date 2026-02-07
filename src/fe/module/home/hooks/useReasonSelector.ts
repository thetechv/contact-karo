import { useState } from "react";

export function useReasonSelector(defaultReason: string = "no-parking") {
  const [selectedReason, setSelectedReason] = useState<string | null>(
    defaultReason,
  );

  return {
    selectedReason,
    setSelectedReason,
  };
}
