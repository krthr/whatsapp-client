export default {
  actualChat: ({ actualChat }) => actualChat,

  chat: ({ chat }) =>
    Object.values(chat).sort((a, b) => Number(b.t) - Number(a.t)), //.map((v) => ({ ...v })),

  contacts: ({ contacts }) => Object.values(contacts),
  state: ({ state }) => state,
};
