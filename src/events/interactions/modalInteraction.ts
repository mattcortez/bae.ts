import {
  bold,
  EmbedBuilder,
  HexColorString,
  InteractionType,
  ModalSubmitInteraction,
  PermissionsBitField,
  RepliableInteraction,
} from "discord.js";
import Event from "@bae/lib/structures/event";
import { constants } from "@bae/lib/utils/constants";

const { emojis, colors } = constants;

export const event: Event<any> = {
  id: "interactionCreate",
  once: false,
  execute: async ({ log, client }, interaction: ModalSubmitInteraction) => {
    if (!InteractionType.ModalSubmit) return;
    if (!interaction.isModalSubmit()) return;
    log("Modal submit detected");

    const modal = client.interactions.get(interaction.customId);
    if (!modal) return;

    try {
      if (modal.permissions) {
        if (
          !interaction.memberPermissions?.has(
            PermissionsBitField.resolve(modal.permissions || [])
          )
        ) {
          const content = bold(
            `${emojis.error} You do not have ${modal.permissions} permissions to use this modal!`
          );
          const userPermsEmbed = new EmbedBuilder()
            .setColor(colors.default as HexColorString)
            .setDescription(content);
          return interaction.reply({
            embeds: [userPermsEmbed],
            ephemeral: true,
          });
        }
      }
      await modal.execute({
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
