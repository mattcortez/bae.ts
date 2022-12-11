import Interaction from "@bae/lib/structures/interaction";

export const interaction: Interaction = {
  name: "testModal",
  permissions: ["Administrator"],
  execute: async ({ client, interaction, log }) => {
    log("Test log from modal");
    interaction.reply(`This is a test modal from ${client.user?.tag}`);
  },
};
