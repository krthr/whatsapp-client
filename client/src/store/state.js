const STATES = {
  LOADING: "LOADING",
  QRCODE: "QRCODE",
  LOGGED_IN: "LOGGED_IN",
};

export default {
  state: STATES.LOADING,

  me: {
    wid: null,
    pushname: null,
  },

  actualChat: null,
  chat: {},
  contacts: {},
};
