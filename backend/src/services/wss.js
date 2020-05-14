const { Server } = require("ws");
const WhatsApp = require("./whatsapp");
const { generateRandomBytes } = require("./crypto");

const wss = new Server({
  port: 4444,
});

wss.on("connection", (ws) => {
  const whatsapp = new WhatsApp();
  let id;

  const send = (c, d) => ws.send(JSON.stringify({ c, d }));

  whatsapp.on("message", (msg) => send(3, msg));
  whatsapp.on("qr-code", (qrCode) => send(1, qrCode));
  whatsapp.on("logged-in", () => {
    console.log(
      `✅ ${id} logged in. Hi ${whatsapp.connectionOpts.pushname}! WID: ${whatsapp.connectionOpts.me}.`
    );

    send(2, {
      wid: whatsapp.connectionOpts.me,
      pushname: whatsapp.connectionOpts.pushname,
    });
  });

  whatsapp.on("init", (clientId) => {
    id = clientId;
    console.log("⚡ WhatsApp service started with id: " + clientId);
  });

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

    console.log("✌ Bye " + id);
  });
});

module.exports = wss;
