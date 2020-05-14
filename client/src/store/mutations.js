import { parseChat, parseContacts } from "../services/buffer";

export default {
  setMe(state, me) {
    state.me = me;
  },

  setState(state, newState) {
    state.state = newState;
  },

  setActualChat(state, actualChat) {
    state.actualChat = actualChat;
  },

  setChat(state, chat) {
    state.chat = chat;
  },

  setContacts(state, contacts) {
    state.contacts = contacts;
  },

  parseMessage(state, message) {
    switch (message[0]) {
      case "action": {
        if (message[1]) {
          const { add } = message[1];
          const data = message[2];

          switch (add) {
            // last messages
            case "before": {
              break;
            }

            // new message
            case "relay": {
              const {
                key: { fromMe, id, remoteJid },
                message: { conversation },
                messageTimestamp,
              } = data[0];

              const jid = remoteJid.split("@")[0];

              console.log(state);
              console.log(state.chat[jid]);

              state.chat[jid].messages = [
                ...state.chat[jid].messages,
                {
                  id,
                  jid,
                  fromMe,
                  conversation,
                  messageTimestamp,
                },
              ];

              state.chat[jid].t = messageTimestamp;

              break;
            }
          }
        }

        break;
      }

      case "response": {
        const { type } = message[1];
        const data = message[2];

        if (type === "chat") {
          parseChat(data);
        } else if (type === "contacts") {
          parseContacts(data);
        }

        break;
      }
    }
  },
};
