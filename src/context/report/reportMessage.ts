import {
  ApplicationCommandType,
  bold,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import ContextMenu from "@bae/lib/structures/context";

export const contextMenu: ContextMenu = {
  options: new ContextMenuCommandBuilder()
    .setName("Report Message")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false),
  global: false,
  execute: async ({ client, interaction, log }) => {
    const message = (interaction as MessageContextMenuCommandInteraction)
      .targetMessage;

    await interaction.reply({
      content: `${bold(
        message.author.username
      )}'s message has been reported. (WIP)`,
      ephemeral: true,
    });

    // Check if reports channel is set
  },
};
