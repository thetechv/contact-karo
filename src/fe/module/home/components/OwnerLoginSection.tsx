import React from "react";
import { ownerLoginStyles } from "../styles/pageStyles";

interface OwnerLoginSectionProps {
  onLoginClick: () => void;
}

export function OwnerLoginSection({ onLoginClick }: OwnerLoginSectionProps) {
  return (
    <div className={ownerLoginStyles.container}>
      <div className={ownerLoginStyles.wrapper}>
        <div className={ownerLoginStyles.iconWrapper}>
          <span className={ownerLoginStyles.icon}>👤</span>
        </div>
        <div className={ownerLoginStyles.content}>
          <h3 className={ownerLoginStyles.title}>Are you the vehicle owner?</h3>
          <p className={ownerLoginStyles.description}>
            Login to update your contact details, manage emergency contacts, and
            ensure people can reach you when needed.
          </p>
          <button onClick={onLoginClick} className={ownerLoginStyles.button}>
            <span>Login to Update Details</span>
            <svg
              className={ownerLoginStyles.buttonIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
