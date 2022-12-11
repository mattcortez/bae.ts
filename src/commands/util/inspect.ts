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
    const ephemeral = interaction.options.getBoolean("ephemeral", false);

    const targetUser = await client.users.fetch(user, { force: true });
    const targetGuildUser = await interaction.guild?.members.fetch(user);
    if (targetGuildUser === undefined) return;

    // Format created/join dates
    const CREATED_AT_DATE = targetUser.createdAt;
    const JOINED_AT_DATE = targetGuildUser.joinedAt;
    if (!JOINED_AT_DATE)
      return interaction.reply({
        content: "Member is not part of this guild!",
      });

    const CREATED_SINCE_FORMAT = formatDistanceStrict(
      CREATED_AT_DATE,
      new Date(),
      {
        unit: "day",
        addSuffix: true,
      }
    );
    const CREATED_AT_DATE_FORMAT = format(CREATED_AT_DATE, "dd MMM yyyy");
    const CREATED_AT_TIME_FORMAT = CREATED_AT_DATE.toLocaleTimeString("en-us", {
      timeZone: "UTC",
      timeStyle: "long",
      hour12: false,
    });

    const JOINED_SINCE_FORMAT = formatDistanceStrict(
      JOINED_AT_DATE,
      new Date(),
      {
        unit: "day",
        addSuffix: true,
      }
    );
    const JOINED_AT_DATE_FORMAT = format(JOINED_AT_DATE, "dd MMM yyyy");
    const JOINED_AT_TIME_FORMAT = JOINED_AT_DATE.toLocaleTimeString("en-us", {
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
            `- ${CREATED_SINCE_FORMAT}\n- ${CREATED_AT_DATE_FORMAT}\n- ${CREATED_AT_TIME_FORMAT}`
          )}`,
          inline: true,
        },
        {
          name: "Joined at:",
          value: `${codeBlock(
            `- ${JOINED_SINCE_FORMAT}\n- ${JOINED_AT_DATE_FORMAT}\n- ${JOINED_AT_TIME_FORMAT}`
          )}`,
          inline: true,
        }
      );

    // Display banner or color banner if null, otherwise display nothing
    if (targetUser.bannerURL() != null) {
      inspectUserEmbed.setImage(`${targetUser.bannerURL({ size: 1024 })}`);
    } else if (targetUser.accentColor) {
      inspectUserEmbed.setImage(
        `https://www.singlecolorimage.com/get/${targetUser.accentColor}/600x150`
      );
    }

    await interaction.reply({
      embeds: [inspectUserEmbed],
      ephemeral: ephemeral != null ? (ephemeral === true ? true : false) : true,
    });
    return;
  },
};
