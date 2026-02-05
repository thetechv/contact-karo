import archiver from "archiver";
import { PassThrough } from "stream";
import QRCode from "qrcode";
import QrTag from "../models/QrTag";

const generateQRZip = async (batchId, options = {}) => {
  const tags = await QrTag.find({ batch_ref: batchId }).lean();
  if (!tags || tags.length === 0) throw new Error("Batch not found");

  const { errorCorrectionLevel = "M", width = 256 } = options;

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();
  const chunks = [];

  const archiveDone = new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
    archive.on("warning", (err) => {
      if (err.code === "ENOENT") return;
      reject(err);
    });
    archive.on("error", reject);
  });

  archive.pipe(stream);

const baseUrl = process.env.BASE_URL;

  for (const tag of tags) {
    const tagId = tag?._id?.toString();
    const tagUrl = `${baseUrl}${tagId}`;
    if (!tagId) continue;
    const pngBuffer = await QRCode.toBuffer(tagUrl, {
      type: "png",
      errorCorrectionLevel,
      width,
    });
    archive.append(pngBuffer, { name: `${tagId}.png` });
  }

  archive.finalize();
  return archiveDone;
};

export default generateQRZip;