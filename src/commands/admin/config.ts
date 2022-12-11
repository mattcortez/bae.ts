import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import DB from "@bae/lib/structures/schemas/configDB";
import Command from "@bae/lib/structures/command";

// Example slash command with options

export const command: Command = {
  options: new SlashCommandBuilder()
    .setName("config")
    .setDescription(
      "Display the guild's configuration in a dynamically updating embed."
    )
    .setDMPermission(false),
  global: false,
  userPermissions: [`Administrator`],
  botPermissions: [`SendMessages`],
  cooldown: 5000,
  execute: async ({ client, interaction, log }) => {
    log("Config command");
    const { guild } = interaction;

    const FUNCTION_ERROR_EMOJI = "<:functionError:972554416970399825>";
    const FUNCTION_SUCCESS_EMOJI = "<:functionSucess:972554406824382505>";
    const TOGGLED_ON_EMOJI = "<:toggleon:1005583586281390080>";
    const TOGGLED_OFF_EMOJI = "<:toggleoff:1005583615658303519>";
    const BUTTON_ON_EMOJI = "<:buttonon:1005970971355783198>";
    const BUTTON_OFF_EMOJI = "<:buttonoff:1005970996215431278>";

    try {
      DB.findOneAndUpdate(
        { guildId: guild?.id },
        { guildId: guild?.id },
        { new: true, upsert: true },
        async (err, data) => {
          if (err) throw err;
          if (!data)
            return interaction.reply({
              content: `${FUNCTION_ERROR_EMOJI} **Something went wrong.**`,
              ephemeral: true,
            });
          if (data) {
            //console.log("data", data);
            //console.log("interaction", interaction);

            const configEmbed = new EmbedBuilder()
              .setColor(`#2f3136`)
              .setAuthor({
                name: `${guild?.name}`,
                iconURL: `${guild?.iconURL()}`,
              })
              .setTitle("Guild Configuration <:beta:1006281880074735646>")
              .addFields(
                {
                  name: "**Moderation**",
                  value: `${
                    data.adminImmunity?.enabled == false
                      ? TOGGLED_OFF_EMOJI
                      : TOGGLED_ON_EMOJI
                  } \`Admin Immunity\`
                ${
                  data.logging?.enabled == false
                    ? TOGGLED_OFF_EMOJI
                    : TOGGLED_ON_EMOJI
                } \`Logging\`
              > ${
                data.logging?.messageLogChannel == null
                  ? BUTTON_OFF_EMOJI
                  : BUTTON_ON_EMOJI
              } \`Message Logs\`: ${
                    data.logging?.messageLogChannel == null
                      ? "none"
                      : `<#${data.logging.messageLogChannel}>`
                  }
              > ${
                data.logging?.modLogChannel == null
                  ? BUTTON_OFF_EMOJI
                  : BUTTON_ON_EMOJI
              } \`Moderation Logs\`: ${
                    data.logging?.modLogChannel == null
                      ? "none"
                      : `<#${data.logging.modLogChannel}>`
                  }
              > ${
                data.logging?.threadLogChannel == null
                  ? BUTTON_OFF_EMOJI
                  : BUTTON_ON_EMOJI
              } \`Thread Logs\`: ${
                    data.logging?.threadLogChannel == null
                      ? "none"
                      : `<#${data.logging.threadLogChannel}>`
                  }
              > ${
                data.logging?.travelLogChannel == null
                  ? BUTTON_OFF_EMOJI
                  : BUTTON_ON_EMOJI
              } \`Travel Logs\`: ${
                    data.logging?.travelLogChannel == null
                      ? "none"
                      : `<#${data.logging.travelLogChannel}>`
                  }
              ${
                data.joinAge?.enabled == false
                  ? TOGGLED_OFF_EMOJI
                  : TOGGLED_ON_EMOJI
              } \`Join Age:\` ${
                    data.joinAge?.joinAge == null
                      ? "none"
                      : `${data.joinAge.joinAge}`
                  }
              ${
                data.blankAvatar?.enabled == false
                  ? TOGGLED_OFF_EMOJI
                  : TOGGLED_ON_EMOJI
              } \`No Blank Avatar\`
              `,
                },
                {
                  name: "Overrides",
                  value: `Coming soon...`,
                }
              )
              .setFooter({
                text: `Select an option you want to edit using the buttons below.`,
              });

            const savedEmbed = new EmbedBuilder()
              .setColor(`#2f3136`)
              .setDescription(
                `${FUNCTION_SUCCESS_EMOJI} **Saved settings and exited configuration menu.**`
              );

            interaction.reply({ embeds: [configEmbed], ephemeral: true });

            setTimeout(function () {
              interaction.editReply({ embeds: [savedEmbed] });
            }, 120 * 1000);
          }
          return;
        }
      );
    } catch (err) {
      console.log(err);
    }
    return;
  },
};
