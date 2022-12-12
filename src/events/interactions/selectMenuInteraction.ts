import {
  AnySelectMenuInteraction,
  bold,
  EmbedBuilder,
  HexColorString,
  InteractionType,
  PermissionsBitField,
  RepliableInteraction,
} from "discord.js";
import Event from "@bae/lib/structures/event";
import { constants } from "@bae/lib/utils/constants";

const { emojis, colors } = constants;

export const event: Event<any> = {
  id: "interactionCreate",
  once: false,
  execute: async ({ log, client }, interaction: AnySelectMenuInteraction) => {
    if (!InteractionType.MessageComponent) return;
    if (!interaction.isAnySelectMenu()) return;
    log("Select menu interaction detected");

    const selectMenu = client.interactions.get(interaction.customId);
    if (!selectMenu) return;

    try {
      if (selectMenu.permissions) {
        if (
          !interaction.memberPermissions?.has(
            PermissionsBitField.resolve(selectMenu.permissions || [])
          )
        ) {
          const content = bold(
            `${emojis.error} You do not have ${selectMenu.permissions} permissions to use this select menu!`
          );
          const userPermsEmbed = new EmbedBuilder()
            .setColor(colors.embed.default as HexColorString)
            .setDescription(content);
          return interaction.reply({
            embeds: [userPermsEmbed],
            ephemeral: true,
          });
        }
      }
      await selectMenu.execute({
        client,
        interaction,
        log,
      });
    } catch (error: unknown) {
      if (error! instanceof Error) {
        console.error(error);
        await replyError(interaction);
      }
    }
    return;
  },
};

// Send a warning on error
async function replyError(interaction: RepliableInteraction) {
  await interaction
    .reply({
      content: "There was an error while executing this interaction.",
      ephemeral: true,
    })
    .catch(console.error);
}
