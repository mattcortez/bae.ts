import Interaction from "@bae/lib/structures/interaction";
import { constants } from "@bae/lib/utils/constants";
import configDB from "@bae/lib/structures/schemas/configDB";
import {
  ActionRowBuilder,
  blockQuote,
  bold,
  ButtonBuilder,
  ButtonStyle,
  channelMention,
  EmbedBuilder,
  HexColorString,
  inlineCode,
  roleMention,
  StringSelectMenuBuilder,
} from "discord.js";

const { emojis, colors } = constants;

export const interaction: Interaction = {
  name: "configLoggingDisable",
  permissions: [],
  execute: async ({ client, interaction, log }) => {
    log(`${interaction.user.tag} clicked on configLoggingDisable`);

    if (!interaction.isButton()) return;
    const { guild } = interaction;
    if (!guild) return;

    let data = await configDB.findOneAndUpdate(
      { guildId: guild.id },
      { $set: { "logging.enabled": false } },
      { returnOriginal: false, upsert: true }
    );

    if (!data) data = await configDB.create({ guildId: guild.id });

    const moderationChannel = getChannelName(data.logging?.moderationChannel);
    const messageChannel = getChannelName(data.logging?.messageChannel);
    const threadChannel = getChannelName(data.logging?.threadChannel);
    const travelChannel = getChannelName(data.logging?.travelChannel);
    const userChannel = getChannelName(data.logging?.userChannel);
    const reportsChannel = getChannelName(data.logging?.reportsChannel);

    const loggingField = `${
      isAllowedChannel(data.logging?.moderationChannel)
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Moderation Logs")}: ${moderationChannel}
    ${
      isAllowedChannel(data.logging?.messageChannel)
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Message Logs")}: ${messageChannel}
    ${
      isAllowedChannel(data.logging?.threadChannel)
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Thread Logs")}: ${threadChannel}
    ${
      isAllowedChannel(data.logging?.travelChannel)
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Travel Logs")}: ${travelChannel}
    ${
      isAllowedChannel(data.logging?.userChannel)
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("User Logs")}: ${userChannel}
    ${
      isAllowedChannel(data.logging?.reportsChannel)
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Reports Channel")}: ${reportsChannel}`;

    const bypassRole = getRole(data.moderation?.bypassRole);
    const joinAge = data.moderation?.joinAge ? this : "none";

    const moderationField = `${
      data.moderation?.adminImmunity?.enabled
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Admin immunity")}
    ${
      isGuildRole(data.moderation?.bypassRole)
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Bypass Role")}: ${bypassRole}
    ${
      data.moderation?.joinAge
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Join Age")}: ${joinAge}
    ${
      data.moderation?.noBlankAvatar?.enabled
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("No blank avatar")}`;

    const featuresField = `${
      data.features?.messageLinkPreview?.enabled
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Message Link Preview")}
    ${
      data.features?.messageLeaderboard?.enabled
        ? emojis.config.buttonOn
        : emojis.config.buttonOff
    } ${inlineCode("Message Leaderboard")} *(Coming soon)*`;

    const configEmbed = new EmbedBuilder()
      .setColor(colors.embed.default as HexColorString)
      .setAuthor({
        name: `${guild.name}`,
        iconURL: `${guild.iconURL()}`,
      })
      .setTitle(`Guild Configuration ${emojis.config.beta}`)
      .setFields(
        {
          name: `${
            data.logging?.enabled
              ? emojis.config.toggleOn
              : emojis.config.toggleOff
          } ${bold("Logging")}`,
          value: blockQuote(loggingField),
          inline: true,
        },
        {
          name: `${
            data.moderation?.enabled
              ? emojis.config.toggleOn
              : emojis.config.toggleOff
          } ${bold("Moderation")}`,
          value: blockQuote(moderationField),
          inline: true,
        },
        {
          name: `${bold("Features")}`,
          value: blockQuote(featuresField),
          inline: false,
        }
      )
      .setFooter({
        text: `Select an option you want to edit using the buttons below.`,
      });

    const actionRow1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("configLogging")
        .setLabel("Logging")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("configLoggingEnable")
        .setLabel(data.logging?.enabled ? "Disable" : "Enable")
        .setStyle(
          data.logging?.enabled ? ButtonStyle.Success : ButtonStyle.Secondary
        )
        .setEmoji(
          data.logging?.enabled
            ? emojis.config.toggleOn
            : emojis.config.toggleOff
        )
    );

    const actionRow2 =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("configLoggingSelectLog")
          .setPlaceholder("Select a log to configure")
          .setMaxValues(1)
          .setOptions(
            {
              label: `Moderation Logs`,
              value: `moderation_option`,
              emoji: `🛠️`,
            },
            {
              label: `Message Logs`,
              value: `message_option`,
              emoji: `💬`,
            },
            {
              label: `Thread Logs`,
              value: `thread_option`,
              emoji: `🧵`,
            },
            {
              label: `Travel Logs`,
              value: `travel_option`,
              emoji: `✈️`,
            },
            {
              label: `User Logs`,
              value: `user_option`,
              emoji: `🗣️`,
            },
            {
              label: `Reports Channel`,
              value: `reports_option`,
              emoji: `📔`,
            }
          )
          .setDisabled(data.logging?.enabled ? false : true)
      );

    const actionRow3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("configBack")
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(emojis.arrowBackward)
    );

    await interaction.update({
      embeds: [configEmbed],
      components: [actionRow1, actionRow2, actionRow3],
    });

    function getChannelName(data: any): string {
      let channel;
      if (data) channel = interaction.guild?.channels.cache.get(data);
      return channel ? channelMention(channel.id) : "none";
    }

    function isAllowedChannel(data: any): boolean {
      const channel = interaction.guild?.channels.cache.get(data);
      if (channel?.isTextBased()) return true;
      if (!channel) return false;
      else return true;
    }

    function getRole(data: any) {
      return isGuildRole(data) ? roleMention(data) : "none";
    }

    function isGuildRole(data: any): boolean {
      const isGuildRole = interaction.guild?.roles.cache.get(data);
      if (!isGuildRole) return false;
      else return true;
    }
  },
};
