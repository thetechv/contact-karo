export const printStickerCSS = `
/* Print styles for sticker components */
@media print {
  body { 
    -webkit-print-color-adjust: exact; 
  }
}

body { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; 
  margin: 0; 
  padding: 20px; 
}

.sticker-container { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 12px; 
  align-items: flex-start; 
}

.sticker {
  position: relative;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.03), transparent 12%), linear-gradient(180deg,#0b0b0b,#121212);
  border: 6px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* Circular stickers for bike batches */
.sticker.circular {
  border-radius: 50%;
}

/* Rectangular stickers for car and other batch types */
.sticker.rectangular {
  border-radius: 12px;
}

.sticker-content { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  z-index: 10; 
}

.top-badge {
  position: absolute;
  top: 4%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  padding: 1% 3%;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 2.5%;
  font-weight: 800;
  letter-spacing: 2px;
}

.qr-wrapper {
  background: white;
  padding: 2%;
  border-radius: 2.5%;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  margin: 2% 0;
}

.emergency-text {
  margin-top: 2%;
  text-align: center;
  font-weight: 800;
  font-size: 4%;
  letter-spacing: 2px;
}

.scan-text {
  margin-top: 0.5%;
  text-align: center;
  font-size: 2.5%;
  font-weight: 800;
  opacity: 0.7;
  letter-spacing: 3px;
}

.powered-by {
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1%;
  background: rgba(255,255,255,0.05);
  padding: 0.8% 2%;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 2%;
  font-weight: 800;
  opacity: 0.9;
  letter-spacing: 2px;
}

.techv-logo {
  width: 3%;
  height: 3%;
  filter: invert(1);
}
`;
