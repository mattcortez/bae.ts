import Interaction from "@bae/lib/structures/interaction";
import { constants } from "@bae/lib/utils/constants";
import { bold, EmbedBuilder, HexColorString } from "discord.js";

const { emojis, colors } = constants;

export const interaction: Interaction = {
  name: "reportModal",
  permissions: [],
  execute: async ({ client, interaction, log }) => {
    log(`${interaction.user.tag} submitted their report modal`);
    const content = bold(
      `${emojis.success} Your report has been successfully submitted.`
    );

    const modalSuccessEmbed = new EmbedBuilder()
      .setColor(colors.default as HexColorString)
      .setDescription(content);

    interaction.reply({ embeds: [modalSuccessEmbed], ephemeral: true });
  },
};
