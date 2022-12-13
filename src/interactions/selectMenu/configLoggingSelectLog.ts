import Interaction from "@bae/lib/structures/interaction";
import { constants } from "@bae/lib/utils/constants";
import {
  ActionRowBuilder,
  blockQuote,
  bold,
  ButtonBuilder,
  ButtonStyle,
  channelMention,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  HexColorString,
  inlineCode,
  roleMention,
  StringSelectMenuBuilder,
} from "discord.js";
import configDB from "@bae/lib/structures/schemas/configDB";

const { emojis, colors } = constants;

export const interaction: Interaction = {
  name: "configLoggingSelectLog",
  permissions: [],
  execute: async ({ client, interaction, log }) => {
    log(`${interaction.user.tag} used configLoggingSelectLog`);
    if (!interaction.isStringSelectMenu()) return;

    const { guild } = interaction;
    if (!guild) return;

    let data = await configDB.findOneAndUpdate(
      { guildId: guild.id },
      { $set: { "logging.currentSelect": interaction.values[0] } },
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

    const actionRow1 =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("configLoggingSelectLog")
          .setPlaceholder("Select a log to configure")
          .setMinValues(1)
          .setMaxValues(1)
          .setOptions(
            {
              label: `Moderation Logs ${
                interaction.values[0] === "moderation_option"
                  ? "(Selected)"
                  : ""
              }`,
              value: `moderation_option`,
              default:
                interaction.values[0] === "moderation_option" ? true : false,
              emoji: data.logging?.moderationChannel
                ? emojis.config.buttonOn
                : emojis.config.buttonOff,
            },
            {
              label: `Message Logs ${
                interaction.values[0] === "message_option" ? "(Selected)" : ""
              }`,
              value: `message_option`,
              default:
                interaction.values[0] === "message_option" ? true : false,
              emoji: data.logging?.messageChannel
                ? emojis.config.buttonOn
                : emojis.config.buttonOff,
            },
            {
              label: `Thread Logs ${
                interaction.values[0] === "thread_option" ? "(Selected)" : ""
              }`,
              value: `thread_option`,
              default: interaction.values[0] === "thread_option" ? true : false,
              emoji: data.logging?.threadChannel
                ? emojis.config.buttonOn
                : emojis.config.buttonOff,
            },
            {
              label: `Travel Logs ${
                interaction.values[0] === "travel_option" ? "(Selected)" : ""
              }`,
              value: `travel_option`,
              default: interaction.values[0] === "travel_option" ? true : false,
              emoji: data.logging?.travelChannel
                ? emojis.config.buttonOn
                : emojis.config.buttonOff,
            },
            {
              label: `User Logs ${
                interaction.values[0] === "user_option" ? "(Selected)" : ""
              }`,
              value: `user_option`,
              default: interaction.values[0] === "user_option" ? true : false,
              emoji: data.logging?.userChannel
                ? emojis.config.buttonOn
                : emojis.config.buttonOff,
            },
            {
              label: `Reports Channel ${
                interaction.values[0] === "reports_option" ? "(Selected)" : ""
              }`,
              value: "reports_option",
              default:
                interaction.values[0] === "reports_option" ? true : false,
              emoji: data.logging?.reportsChannel
                ? emojis.config.buttonOn
                : emojis.config.buttonOff,
            }
          )
          .setDisabled(data.logging?.enabled ? false : true)
      );

    const actionRow2 =
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("configLoggingSelectChannel")
          .setChannelTypes(ChannelType.GuildText, ChannelType.PrivateThread)
          .setMinValues(1)
          .setMaxValues(1)
          .setPlaceholder("Select a channel")
      );

    const actionRow3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("configLogging")
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(emojis.arrowBackward)
    );

    interaction.update({
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
