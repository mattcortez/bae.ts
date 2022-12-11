import {
  ApplicationCommandType,
  bold,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import ContextMenu from "@bae/lib/structures/context";

export const contextMenu: ContextMenu = {
  options: new ContextMenuCommandBuilder()
    .setName("Report User")
    .setType(ApplicationCommandType.User) // Specify the context menu type
    .setDMPermission(false),
  global: false,
  cooldown: 10_000,
  execute: async ({ client, interaction, log }) => {
    const user = (interaction as UserContextMenuCommandInteraction).targetUser;

    await interaction.reply({
      content: `${bold(user.tag)}has been reported. (WIP)`,
      ephemeral: true,
    });
  },
};
