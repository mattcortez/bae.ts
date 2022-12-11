import Interaction from "@bae/lib/structures/interaction";

export const interaction: Interaction = {
  name: "testButton",
  permissions: ["Administrator"],
  execute: async ({ client, interaction, log }) => {
    log(`${interaction.user.tag} clicked on testButton`);
    interaction.reply({
      content: `Hey lol`,
      ephemeral: true,
    });
  },
};
