import Event from "../../lib/structures/event";

export const event: Event<any> = {
  id: "messageCreate",
  once: false,
  execute: async ({ log }, client) => {
    log(`Message received`);
  },
};
