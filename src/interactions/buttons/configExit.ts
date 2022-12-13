import Interaction from "@bae/lib/structures/interaction";
import { constants } from "@bae/lib/utils/constants";
import { bold, EmbedBuilder, HexColorString } from "discord.js";

const { emojis, colors } = constants;

export const interaction: Interaction = {
  name: "configExit",
  permissions: [],
  execute: async ({ client, interaction, log }) => {
    log(`${interaction.user.tag} clicked on configExit`);
    if (!interaction.isButton()) return;

    const savedEmbed = new EmbedBuilder()
      .setColor(colors.embed.default as HexColorString)
      .setDescription(
        bold(`${emojis.success} Saved settings and exited configuration menu.`)
      );

    return interaction.update({ embeds: [savedEmbed], components: [] });
  },
};
