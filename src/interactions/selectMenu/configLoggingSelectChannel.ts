import Interaction from "@bae/lib/structures/interaction";
import { constants } from "@bae/lib/utils/constants";
import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonStyle,
  channelMention,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  HexColorString,
  roleMention,
} from "discord.js";
import configDB from "@bae/lib/structures/schemas/configDB";

const { emojis, colors } = constants;

export const interaction: Interaction = {
  name: "configLoggingSelectChannel",
  permissions: [],
  execute: async ({ client, interaction, log }) => {
    log(`${interaction.user.tag} used configLoggingSelectChannel`);
    if (!interaction.isChannelSelectMenu()) return;

    const { guild } = interaction;
    if (!guild) return;

    let data = await configDB.findOne({ guildId: guild.id });
    if (!data) data = await configDB.create({ guildId: guild.id });

    const selectedChannel = interaction.guild?.channels.cache.get(
      interaction.values[0]
    );
    if (!selectedChannel)
      return interaction.reply("This channel does not exist");

    console.log("interaction values", interaction.values[0]);
    const options = {
      moderation_option: "moderationChannel",
      message_option: "messageChannel",
      thread_option: "threadChannel",
      travel_option: "travelChannel",
      user_option: "userChannel",
      reports_option: "reportsChannel",
    };

    for (const [key, value] of Object.entries(options)) {
      if (data.logging?.currentSelect == key)
        await data.set({ [`logging.${value}`]: selectedChannel.id }).save();
    }

    const configEmbed = new EmbedBuilder()
      .setColor(colors.embed.default as HexColorString)
      .setDescription(
        bold(`${emojis.success} Your changes have been applied.`)
      );

    // const actionRow1 =
    //   new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
    //     new ChannelSelectMenuBuilder()
    //       .setCustomId("configLoggingSelectChannel")
    //       .setChannelTypes(ChannelType.GuildText, ChannelType.PrivateThread)
    //       .setMinValues(1)
    //       .setMaxValues(1)
    //       .setPlaceholder("Select a channel")
    //       .setDisabled(true)
    //   );

    const actionRow2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("configLogging")
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(emojis.arrowBackward)
    );

    return interaction.update({
      embeds: [configEmbed],
      components: [actionRow2],
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
