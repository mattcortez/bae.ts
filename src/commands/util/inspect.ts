import {
  codeBlock,
  EmbedBuilder,
  HexColorString,
  SlashCommandBuilder,
} from "discord.js";
import { constants } from "@bae/lib/utils/constants";
import { format, formatDistanceStrict } from "date-fns";
import Command from "@bae/lib/structures/command";

export const command: Command = {
  options: new SlashCommandBuilder()
    .setName("inspect")
    .setDescription("Inspect an element")
    .setDMPermission(false)
    .addSubcommand((user) =>
      user
        .setName("user")
        .setDescription("Get information about a specific user")
        .addUserOption((option) =>
          option.setName("user").setDescription("Specify the user")
        )
        .addBooleanOption((ephemeral) =>
          ephemeral
            .setName("ephemeral")
            .setDescription("Change the message visibility (default: True)")
        )
    ),
  global: false,
  userPermissions: [`SendMessages`],
  botPermissions: [`SendMessages`],
  cooldown: 5000,
  execute: async ({ client, interaction, log }) => {
    const user = interaction.options.getUser("user", false) || interaction.user;
    const isEphemeral = interaction.options.getBoolean("ephemeral", false);

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
      .setColor(constants.colors.default as HexColorString)
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

    // Display banner or color banner if null, otherwise display nothing
    // if (targetUser.bannerURL() != null) {
    //   inspectUserEmbed.setImage(`${targetUser.bannerURL({ size: 1024 })}`);
    // } else if (targetUser.accentColor) {
    //   inspectUserEmbed.setImage(
    //     `https://www.singlecolorimage.com/get/${targetUser.accentColor}/600x150`
    //   );
    // }

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
      ephemeral: !isEphemeral ? true : isEphemeral === true ? true : false,
    });
    return;
  },
};
