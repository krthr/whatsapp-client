const ws = new WebSocket("ws://localhost:4444");

export const send = (msg) => ws.send(JSON.stringify(msg));

export const onMessage = (fn) =>
  ws.addEventListener("message", (message) => fn(JSON.parse(message.data)));

export const onClose = (fn) => ws.addEventListener("close", fn);
export const onError = (fn) => ws.addEventListener("error", fn);
export const onOpen = (fn) => ws.addEventListener("open", fn);
