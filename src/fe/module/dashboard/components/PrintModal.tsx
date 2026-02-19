"use client";
import { useState } from "react";
import QRCodeLib from "qrcode";
import { Modal } from "@/fe/components/ui/Modal";
import { Button } from "@/fe/components/ui/Button";
import { Input } from "@/fe/components/ui/Input";
import { Select } from "@/fe/components/ui/Select";
import type { Batch } from "../constants";
import { printStickerCSS } from "../styles";

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch | null;
}

const convertToPx = (value: number, unit: string): number => {
  const dpi = 96; // assume 96 dpi
  if (unit === "in") return value * dpi;
  if (unit === "cm") return (value * dpi) / 2.54;
  if (unit === "ft") return value * dpi * 12;
  return value;
};

// Define sticker dimensions for different batch types
const getStickerDimensions = (
  batchType: string,
): { width: number; height: number } => {
  const dimensions = {
    car: { width: 3.37, height: 2.125 }, // Credit card size
    bike: { width: 2.1, height: 2.1 }, // Circular diameter
    "bag-tag": { width: 1.0, height: 1.0 },
    "door-tag": { width: 2.0, height: 2.0 },
    "business-card": { width: 3.37, height: 2.125 },
  };
  return (
    dimensions[batchType as keyof typeof dimensions] || {
      width: 2.0,
      height: 2.0,
    }
  );
};

// Determine sticker shape based on batch type
const getStickerShape = (batchType: string): string => {
  return batchType === "bike" ? "circular" : "rectangular";
};

export const PrintModal = ({ isOpen, onClose, batch }: PrintModalProps) => {
  const [paperWidth, setPaperWidth] = useState(8.5);
  const [paperHeight, setPaperHeight] = useState(11);
  const [paperUnit, setPaperUnit] = useState("in");

  if (!batch) return null;

  const handlePrint = async () => {
    if (!batch) return;

    try {
      const response = await fetch(`/api/v0/tag/batch/${batch._id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch QR tags");
      }

      const qrCodes = result.data.map(
        (tag: { qr_id: string }) => `${window.location.origin}/${tag.qr_id}`,
      );

      // Generate QR code data URLs
      const stickerDimensions = getStickerDimensions(batch.type);
      const stickerWidthInPx = Math.round(
        convertToPx(stickerDimensions.width, "in"),
      );
      const stickerHeightInPx = Math.round(
        convertToPx(stickerDimensions.height, "in"),
      );
      const qrSizeInPx = Math.round(
        Math.min(stickerWidthInPx, stickerHeightInPx) * 0.4,
      );

      const dataUrls = await Promise.all(
        qrCodes.map((qr: string) =>
          QRCodeLib.toDataURL(qr, { width: qrSizeInPx, margin: 1 }),
        ),
      );

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        const styles = `
          <style>
            ${printStickerCSS}
            @page { size: ${paperWidth}${paperUnit} ${paperHeight}${paperUnit}; margin: 0.5in; }
            .sticker {
              width: ${stickerWidthInPx}px;
              height: ${stickerHeightInPx}px;
            }
          </style>
        `;

        const stickerShape = getStickerShape(batch.type);
        const stickersHtml = dataUrls
          .map((dataUrl: string) => {
            return `
              <div class="sticker ${stickerShape}">
                <div class="top-badge">contactKaro.in</div>
                <div class="sticker-content">
                  <div class="qr-wrapper">
                    <img src="${dataUrl}" width="${qrSizeInPx}" height="${qrSizeInPx}" />
                  </div>
                  <div class="emergency-text">IN CASE OF EMERGENCY</div>
                  <div class="scan-text">SCAN TO CONTACT</div>
                </div>
                <div class="powered-by">
                  <img src="/techv.png" alt="TechV" class="techv-logo" />
                  <span>BY TECHV</span>
                </div>
              </div>
            `;
          })
          .join("");

        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Codes for ${batch.batch_id}</title>
              ${styles}
            </head>
            <body>
              <h1>Batch: ${batch.batch_id}</h1>
              <div class="sticker-container">${stickersHtml}</div>
              <script>window.onload = () => { window.focus(); window.print(); };</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error("Printing error:", error);
      alert("Could not generate print preview. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download Print Options">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="paper-dimension"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Print Paper Dimension
          </label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="paper-dimension-width"
              type="number"
              placeholder="Width"
              value={paperWidth}
              onChange={(e) => setPaperWidth(Number(e.target.value))}
            />
            <Input
              id="paper-dimension-height"
              type="number"
              placeholder="Height"
              value={paperHeight}
              onChange={(e) => setPaperHeight(Number(e.target.value))}
            />
            <Select
              id="paper-dimension-unit"
              value={paperUnit}
              onChange={(e) => setPaperUnit(e.target.value)}
              options={[
                { value: "in", label: "inch" },
                { value: "cm", label: "cm" },
              ]}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sticker Size
          </label>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {(() => {
              const dims = getStickerDimensions(batch.type);
              const shape = getStickerShape(batch.type);
              if (shape === "circular") {
                return `${dims.width}" diameter (circular - auto-determined by batch type: ${batch.type})`;
              } else {
                return `${dims.width}" × ${dims.height}" (rectangular - auto-determined by batch type: ${batch.type})`;
              }
            })()}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePrint}>Download</Button>
        </div>
      </div>
    </Modal>
  );
};
