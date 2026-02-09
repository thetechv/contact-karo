"use client";
import { useState } from "react";
import QRCodeLib from "qrcode";
import { Modal } from "@/fe/components/ui/Modal";
import { Button } from "@/fe/components/ui/Button";
import { Input } from "@/fe/components/ui/Input";
import { Select } from "@/fe/components/ui/Select";
import type { Batch } from "../constants";
import { Sticker } from "./Sticker";

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

export const PrintModal = ({ isOpen, onClose, batch }: PrintModalProps) => {
  const [paperWidth, setPaperWidth] = useState(8.5);
  const [paperHeight, setPaperHeight] = useState(11);
  const [paperUnit, setPaperUnit] = useState("in");
  const [qrSize, setQrSize] = useState(2);
  const [qrUnit, setQrUnit] = useState("in");

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

      // Generate data URLs for each QR code using `qrcode` lib
      const stickerSizeInPx = Math.round(convertToPx(qrSize, qrUnit));
      const dataUrls = await Promise.all(
        qrCodes.map((qr: string) =>
          QRCodeLib.toDataURL(qr, { width: stickerSizeInPx }),
        ),
      );

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        const styles = `
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
              @page { size: ${paperWidth}${paperUnit} ${paperHeight}${paperUnit}; margin: 0.5in; }
            }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
            .sticker-container { display:flex; flex-wrap:wrap; gap:12px; align-items:flex-start; }
            .sticker { display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000; color:#fff; border-radius:9999px; padding:8px; box-sizing:border-box; }
            .sticker .badge { position:relative; top:0; background:#374151; padding:4px 8px; border-radius:9999px; font-size:10px; }
            .sticker .qr-wrap { background:#fff; padding:8px; border-radius:8px; margin:8px 0; }
            .sticker .title { font-weight:700; font-size:12px; text-align:center; }
            .sticker .subtitle { font-size:10px; letter-spacing:2px; }
            .powered { display:flex; align-items:center; gap:6px; font-size:10px; }
          </style>
        `;

        const stickersHtml = dataUrls
          .map((dataUrl: string) => {
            return `
              <div class="sticker" style="width:${stickerSizeInPx}px; height:${stickerSizeInPx}px;">
                <div class="badge">contactkaro.in</div>
                <div class="qr-wrap"><img src="${dataUrl}" width="${stickerSizeInPx * 0.9}" height="${stickerSizeInPx * 0.9}"/></div>
                <div class="title">IN CASE OF EMERGENCY</div>
                <div class="subtitle">SCAN TO CONTACT</div>
                <div class="powered">⎊ POWERED BY TECHV</div>
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
          <label
            htmlFor="qr-size"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            QR Code Size
          </label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="qr-size-value"
              type="number"
              placeholder="Size"
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
            />
            <Select
              id="qr-size-unit"
              value={qrUnit}
              onChange={(e) => setQrUnit(e.target.value)}
              options={[
                { value: "in", label: "inch" },
                { value: "cm", label: "cm" },
                { value: "px", label: "px" },
              ]}
            />
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
