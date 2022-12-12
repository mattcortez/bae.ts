import Interaction from "@bae/lib/structures/interaction";
import { constants } from "@bae/lib/utils/constants";
import { bold, EmbedBuilder, HexColorString } from "discord.js";

const { emojis, colors } = constants;

export const interaction: Interaction = {
  name: "testSelectMenu",
  permissions: [],
  execute: async ({ client, interaction, log }) => {
    log(`${interaction.user.tag} test slectmenu`);
    const content = bold(`${emojis.success} SLECT MENU TEST`);

    const modalSuccessEmbed = new EmbedBuilder()
      .setColor(colors.embed.default as HexColorString)
      .setDescription(content);

    interaction.reply({ embeds: [modalSuccessEmbed], ephemeral: true });
  },
};
