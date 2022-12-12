import {
  bold,
  ButtonInteraction,
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
  execute: async ({ log, client }, interaction: ButtonInteraction) => {
    if (!InteractionType.MessageComponent) return;
    if (!interaction.isButton()) return;
    log("Button click detected");

    const button = client.interactions.get(interaction.customId);
    if (!button) return;

    try {
      if (button.permissions) {
        if (
          !interaction.memberPermissions?.has(
            PermissionsBitField.resolve(button.permissions || [])
          )
        ) {
          const content = bold(
            `${emojis.error} You do not have ${button.permissions} permissions to use this button!`
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
      await button.execute({
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
