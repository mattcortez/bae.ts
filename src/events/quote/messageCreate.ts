import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  HexColorString,
  Message,
  TextChannel,
} from "discord.js";
import Event from "../../lib/structures/event";
import { constants } from "@bae/lib/utils/constants";
const { regexes, emojis } = constants;

export const event: Event<any> = {
  id: "messageCreate",
  once: false,
  execute: async ({ log, client }, message: Message) => {
    if (message.author.bot) return;

    let messageLink: RegExpExecArray | null;
    while ((messageLink = regexes.discord.message.exec(message.content))) {
      const group = messageLink.groups;
      if (group === undefined) return;

      // Check if bot has access to channel the message is in
      const channel = client.channels.cache.get(
        group.channel_id
      ) as TextChannel;
      if (!channel) return log("Channel not found!");

      const targetMessage: Message = await channel.messages.fetch(
        group.message_id
      );

      // Create jump to message button
      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
          .setLabel("Jump to message")
          .setURL(`${targetMessage.url}`)
          .setStyle(ButtonStyle.Link),
      ]);

      // Manipulate string to convey attachments/embed/files
      let description = "";
      var hasAttachment =
        targetMessage.attachments.size > 0
          ? "*This message contains an attachment* <:messageFile:990919075851034634>"
          : null;
      if (targetMessage.attachments.size > 1)
        hasAttachment =
          "*This message contains multiple attachments* <:messageFile:990919075851034634>";

      var hasSticker =
        targetMessage.stickers.size > 0
          ? "*This message contains a sticker* <:messageSticker:990949959589331044>"
          : null;

      var hasBoth =
        targetMessage.attachments.size > 0 && targetMessage.stickers.size > 0
          ? "*This message contains an attachment and a sticker* <:messageFile:990919075851034634><:messageSticker:990949959589331044>"
          : null;
      if (targetMessage.attachments.size > 1 && targetMessage.stickers.size > 0)
        hasBoth =
          "*This message contains multiple attachments and a sticker* <:messageFile:990919075851034634><:messageSticker:990949959589331044>";

      description = [
        targetMessage.content,
        hasBoth ? hasBoth : hasAttachment,
        hasBoth ? null : hasSticker,
      ]
        .filter(Boolean)
        .join("\n\n");

      if (targetMessage.embeds.length > 0) {
        description = [
          targetMessage.content,
          "*This message contains an embed* <:messageEmbed:990976873943167007>",
        ]
          .filter(Boolean)
          .join("\n\n");
      }

      // Create the embed
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${targetMessage.author.tag}`,
          iconURL: `${targetMessage.author.displayAvatarURL()}`,
        })
        .setColor(constants.colors.default as HexColorString)
        .setDescription(`${description}`);
      //.setFooter({ text: `#${channel.name}` })
      //.setTimestamp(targetMessage.createdTimestamp);

      if (targetMessage.attachments.size > 0) {
        const array = [...targetMessage.attachments.values()][0];

        if (
          array.contentType == "image/png" ||
          array.contentType == "image/jpeg" ||
          array.contentType == "image/webp"
        ) {
          embed.setImage(array.attachment.toString());
        }
      }

      // Reply to the initial message
      await message.reply({
        embeds: [embed],
        components: [actionRow],
        allowedMentions: { repliedUser: false },
      });
      return;
    }
  },
};
