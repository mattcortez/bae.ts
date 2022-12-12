import {
  ApplicationCommandType,
  codeBlock,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  HexColorString,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { format, formatDistanceStrict } from "date-fns";
import { constants } from "@bae/lib/utils/constants";
import ContextMenu from "@bae/lib/structures/context";

const { colors } = constants;

export const contextMenu: ContextMenu = {
  options: new ContextMenuCommandBuilder()
    .setName("Inspect User")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  global: false,
  cooldown: 10_000,
  execute: async ({ client, interaction, log }) => {
    const user = (interaction as UserContextMenuCommandInteraction).targetUser;

    const targetUser = await client.users.fetch(user, { force: true });
    const targetGuildUser = await interaction.guild?.members.fetch(user);
    if (!targetGuildUser)
      return interaction.reply({
        content: "Member not found",
        ephemeral: true,
      });

    // Format created/join dates
    const createdAtDate = targetUser.createdAt;
    const joinedAtDate = targetGuildUser.joinedAt;
    if (!joinedAtDate)
      return interaction.reply({
        content: "Member is not part of this guild!",
      });

    const createdSinceFormat = formatDistanceStrict(createdAtDate, new Date(), {
      unit: "day",
      addSuffix: true,
    });
    const createdAtDateFormat = format(createdAtDate, "dd MMM yyyy");
    const createdAtTimeFormat = createdAtDate.toLocaleTimeString("en-us", {
      timeZone: "UTC",
      timeStyle: "long",
      hour12: false,
    });

    const joinedSinceFormat = formatDistanceStrict(joinedAtDate, new Date(), {
      unit: "day",
      addSuffix: true,
    });
    const joinedAtDateFormat = format(joinedAtDate, "dd MMM yyyy");
    const joinedAtTimeFormat = joinedAtDate.toLocaleTimeString("en-us", {
      timeZone: "UTC",
      timeStyle: "long",
      hour12: false,
    });

    // Create the embed
    const inspectUserEmbed = new EmbedBuilder()
      .setColor(colors.embed.default as HexColorString)
      .setAuthor({
        name: `${targetUser.tag} ${
          targetGuildUser.nickname ? `(aka ${targetGuildUser.nickname})` : ``
        }`,
        iconURL: `${targetGuildUser.displayAvatarURL()}`,
      })
      .addFields(
        { name: "Simp:", value: `${codeBlock("True")}`, inline: true },
        {
          name: "User ID:",
          value: `${codeBlock(`${targetUser.id}`)}`,
          inline: true,
        },
        {
          name: "Bot:",
          value: `${codeBlock(`${targetUser.bot}`)}`,
          inline: true,
        },
        {
          name: "Created at:",
          value: `${codeBlock(
            `- ${createdSinceFormat}\n- ${createdAtDateFormat}\n- ${createdAtTimeFormat}`
          )}`,
          inline: true,
        },
        {
          name: "Joined at:",
          value: `${codeBlock(
            `- ${joinedSinceFormat}\n- ${joinedAtDateFormat}\n- ${joinedAtTimeFormat}`
          )}`,
          inline: true,
        }
      );

    if (!targetUser.bannerURL()) {
      if (targetUser.accentColor) {
        const accentColorImage = `https://www.singlecolorimage.com/get/${targetUser.accentColor}/600x150`;
        inspectUserEmbed.setImage(accentColorImage);
      }
    } else {
      inspectUserEmbed.setImage(`${targetUser.bannerURL({ size: 1024 })}`);
    }

    await interaction.reply({
      embeds: [inspectUserEmbed],
      ephemeral: true,
    });
    return;
  },
};
