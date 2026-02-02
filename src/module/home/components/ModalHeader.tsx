import React from "react";
import { ownerModalStyles } from "../styles/ownerModalStyles";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className={ownerModalStyles.header.container}>
      <div className={ownerModalStyles.header.wrapper}>
        <h2 className={ownerModalStyles.header.title}>{title}</h2>
        <button
          onClick={onClose}
          type="button"
          className={ownerModalStyles.header.closeButton}
          aria-label="Close modal"
        >
          <svg
            className={ownerModalStyles.header.closeIcon}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
