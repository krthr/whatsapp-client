const { Server } = require("ws");
const WhatsApp = require("./whatsapp");
const { generateRandomBytes } = require("./crypto");
const { showQRCode } = require("../utils");

const wss = new Server({
  port: 4444,
});

wss.on("connection", (ws) => {
  const id = generateRandomBytes(10);
  const whatsapp = new WhatsApp();

  const send = (c, d) => ws.send(JSON.stringify({ c, d }));

  whatsapp.on("message", (msg) => send(3, msg));
  whatsapp.on("qr-code", (qrCode) => {
    // showQRCode(qrCode);
    send(1, qrCode);
  });
  whatsapp.on("logged-in", () => send(2, true));

  ws.on("message", (message) => {
    try {
      message = JSON.parse(message);

      switch (message.c) {
        // start whatsapp and send client id
        case 0: {
          whatsapp.start();
          send(0, id);
        }
      }
    } catch (e) {}
  });

  ws.on("close", () => {
    if (whatsapp && whatsapp.ws) {
      whatsapp.ws.close();
    }
  });
});
