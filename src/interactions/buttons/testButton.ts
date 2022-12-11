import Interaction from "@bae/lib/structures/interaction";

export const interaction: Interaction = {
  name: "testButton",
  permissions: ["Administrator"],
  execute: async ({ client, interaction, log }) => {
    log("Test log from button");
    interaction.reply(`This is a test button from ${client.user?.tag}`);
  },
};
