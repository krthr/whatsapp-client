const QR = require("qrcode");
const QRTerminal = require("qrcode-terminal");

const showQRCode = (txt = "") => {
  QRTerminal.generate(txt, {
    small: true,
  });

  QR.toFile("./qr.png", txt, console.log);
};

module.exports = {
  showQRCode,
};
