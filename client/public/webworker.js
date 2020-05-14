importScripts(["https://bundle.run/buffer@5.6.0"]);

const Buffer = buffer.Buffer;

const parse = (temp) => {
  if (!temp) return "";
  if (!temp.data) return temp;
  return Buffer.from(temp.data).toString();
};

const parseData = (data) => {
  const parsedData = {};

  for (let item of data) {
    const temp = item[1];
    for (let key in temp) temp[key] = parse(temp[key]);

    temp["jid"] = temp["jid"].split("@")[0];
    parsedData[temp.jid] = temp;
  }

  return parsedData;
};

/**
 *
 * @param {Array<Array<any>>} data
 */
const parseChat = (data) => {
  const parsedData = parseData(data);

  return Object.values(parsedData).reduce((acc, curr) => {
    acc[curr.jid] = {
      ...curr,
      messages: [],
    };

    return acc;
  }, {});
};
const parseContacts = parseData;

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
