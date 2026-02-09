"use client";

import { QRCodeCanvas } from "qrcode.react";

interface StickerProps {
  qrCodeValue: string;
  size: number; // size in pixels
}

export const Sticker = ({ qrCodeValue, size }: StickerProps) => {
  const stickerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const qrCodeSize = size * 0.4; // QR code is 40% of the sticker size

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-full bg-black text-white"
      style={stickerStyle}
    >
      <div className="absolute top-[10%] rounded-full bg-gray-700 px-3 py-1 text-xs">
        contactkaro.in
      </div>
      <div className="p-2 bg-white rounded-lg">
        <QRCodeCanvas value={qrCodeValue} size={qrCodeSize} />
      </div>
      <div className="mt-2 text-center">
        <p className="font-bold text-sm">IN CASE OF EMERGENCY</p>
        <p className="text-xs tracking-widest">SCAN TO CONTACT</p>
      </div>
      <div className="absolute bottom-[10%] flex items-center text-xs">
        <span className="mr-1">⎊</span> POWERED BY TECHV
      </div>
    </div>
  );
};
