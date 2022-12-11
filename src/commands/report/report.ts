import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
//import { constants } from "@bae/lib/utils/constants";
import Command from "@bae/lib/structures/command";

export const command: Command = {
  options: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Write a report")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Specify the user you want to report")
        .setRequired(true)
    ),
  global: false,
  userPermissions: [`SendMessages`],
  botPermissions: [`SendMessages`],
  cooldown: 5000,
  execute: async ({ client, interaction, log }) => {
    const user = interaction.options.getUser("user", true) || interaction.user;
    //const targetUser = await client.users.fetch(user, { force: true });
    const targetGuildUser = await interaction.guild?.members.fetch(user);

    const reportModal = new ModalBuilder()
      .setCustomId("testModal")
      .setTitle("Report");

    const reportInput = new TextInputBuilder()
      .setCustomId("reportInput")
      .setRequired(true)
      .setMinLength(20)
      .setMaxLength(1000)
      .setLabel(`📫 Write a comment about ${targetGuildUser?.displayName}`)
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Advertising...");

    const actionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
        reportInput,
      ]);

    reportModal.addComponents([actionRow]);

    await interaction.showModal(reportModal);
  },
};
