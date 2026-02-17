import React from "react";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  value?: string;
  size?: number; // diameter in px
};

export default function StickerOnly({ value, size = 360 }: Props) {
  const qrSize = Math.round(size * 0.44);

  return (
    <div
      className="relative rounded-full overflow-hidden shadow-2xl border-[6px] border-white/5 flex items-center justify-center text-white"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.03), transparent 12%), linear-gradient(180deg,#0b0b0b,#121212)",
      }}
      aria-label="Emergency sticker"
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1 rounded-full border border-white/6 text-[10px] font-extrabold tracking-wider">
        contactKaro.in
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-white p-3 rounded-xl shadow-lg">
          {value ? (
            <QRCodeSVG value={value} size={qrSize} level="H" />
          ) : (
            <div className="w-[${qrSize}px] h-[${qrSize}px] flex items-center justify-center text-xs font-bold text-black">
              NO QR DATA
            </div>
          )}
        </div>

        <div className="mt-3 text-center font-extrabold text-[14px] tracking-wider">
          IN CASE OF EMERGENCY
        </div>
        <div className="mt-1 text-center text-[10px] font-extrabold opacity-70 tracking-widest">
          SCAN TO CONTACT
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/6">
        <img
          src="/techv.png"
          alt="TechV"
          className="w-4 h-4 object-contain invert"
        />
        <div className="text-[11px] font-extrabold opacity-90 tracking-wider">
          POWERED BY TECHV
        </div>
      </div>
    </div>
  );
}
