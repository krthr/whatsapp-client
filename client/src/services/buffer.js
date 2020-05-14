import store from "../store";

const worker = new Worker("webworker.js");
const postMessage = (d) => worker.postMessage(d);

worker.onmessage = ({ data: { type, data } }) => {
  switch (type) {
    case "contacts": {
      store.commit("setContacts", data);
      break;
    }

    case "chat": {
      // console.log({ data });
      break;
    }
  }
};

export const parseContacts = (data) => postMessage({ type: "contacts", data });
export const parseChat = (data) => postMessage({ type: "chat", data });
