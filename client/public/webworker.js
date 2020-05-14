importScripts(["https://bundle.run/buffer@5.6.0"]);

const Buffer = buffer.Buffer;

const parse = (temp) => {
  if (!temp) return "";
  if (!temp.data) return temp;
  return Buffer.from(temp.data).toString();
};

/**
 *
 * @param {Array<Array<any>>} data
 */
const parseChat = (data) => {
  const chat = {};

  for (let chatData of data) {
    const temp = chatData[1];

    for (let key in temp) temp[key] = parse(temp[key]);

    if (!chat[temp.jid]) {
      chat[temp.jid] = [];
    }

    chat[temp.jid] = [...chat[temp.jid], temp];
  }

  return chat;
};

/**
 *
 * @param {Array<Array<any>>} data
 */
const parseContacts = (data) => {
  const contacts = {};

  for (let user of data) {
    const temp = user[1];
    for (let key in temp) temp[key] = parse(temp[key]);
    contacts[temp.jid] = temp;
  }

  return contacts;
};

onmessage = ({ data: { type, data } }) => {
  switch (type) {
    case "contacts": {
      postMessage({ type: "contacts", data: parseContacts(data) });
      break;
    }

    case "chat": {
      postMessage({ type: "chat", data: parseChat(data) });
      break;
    }
  }
};
