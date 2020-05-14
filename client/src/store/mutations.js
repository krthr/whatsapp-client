import { parseChat, parseContacts } from "../services/buffer";

export default {
  addMessage(state, newMessage) {},

  setState(state, newState) {
    state.state = newState;
  },

  setContacts(state, contacts) {
    state.contacts = contacts;
  },

  parseMessage(state, message) {
    switch (message[0]) {
      case "action": {
        if (message[1]) {
          const { add, last } = message[1];

          switch (add) {
            // last messages
            case "before": {
              break;
            }

            // new message
            case "relay": {
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

    console.log(message);
  },
};
