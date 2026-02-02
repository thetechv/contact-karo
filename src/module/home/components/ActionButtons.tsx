"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { actionButtonStyles } from "@/module/home/styles/actionStyles";

interface ActionButtonsProps {
  onMessage: () => void;
  onPrivateCall: () => void;
  onDocuments: () => void;
  onEmergency: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onMessage,
  onPrivateCall,
  onDocuments,
  onEmergency,
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onMessage} className={actionButtonStyles.message}>
          Message
        </button>

        <button
          onClick={onPrivateCall}
          className={actionButtonStyles.privateCall}
        >
          Private Call
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onDocuments} className={actionButtonStyles.documents}>
          Documents
        </button>

        <button onClick={onEmergency} className={actionButtonStyles.emergency}>
          <span className="text-lg">🚨</span>
          <span>Emergency</span>
        </button>
      </div>
    </div>
  );
};
