"use client";

import React from "react";
import { actionButtonStyles } from "@/fe/module/home/styles/actionStyles";

interface ActionButtonsProps {
  onMessage: () => void;
  onPrivateCall: () => void;
  onEmergency: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onMessage,
  onPrivateCall,
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
      <div className="w-full">
        <button onClick={onEmergency} className={actionButtonStyles.emergency}>
          <span className="text-lg">🚨</span>
          <span>Emergency</span>
        </button>
      </div>
    </div>
  );
};
