const WhatsApp = require("./src/services/whatsapp");
const { showQRCode } = require("./src/utils");
const logger = require("./src/services/logger");

const whatsapp = new WhatsApp();

whatsapp.on("message", (msg) => {
  //console.log(msg);
  logger.info(msg);
});
whatsapp.on("qr-code", (qrCode) => showQRCode(qrCode));
whatsapp.on("logged-in", () => console.log("¡Bienvenido!"));

whatsapp.start();
