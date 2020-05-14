import QRCode from "qrcode";

export const generateQrCode = async (qrCode) => {
  const url = await QRCode.toDataURL(qrCode, {
    errorCorrectionLevel: "M",
  });

  return url;
};
