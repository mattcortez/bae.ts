import { Interaction, InteractionType, RepliableInteraction } from "discord.js";
import Event from "../../lib/structures/event";

export const event: Event<any> = {
  id: "interactionCreate",
  once: false,
  execute: async ({ log, client }, interaction: Interaction) => {
    switch (interaction.type) {
      // Command
      case InteractionType.ApplicationCommand:
        // Chat Input Command
        if (interaction.isChatInputCommand()) {
          const command = client.commands.get(interaction.commandName);
          if (!command) return;

          try {
            await command.execute({ client, interaction, log });
          } catch (error: unknown) {
            if (error! instanceof Error) {
              console.error(error);
              await replyError(interaction);
            }
          }
        }

        // Context Menu
        else if (interaction.isContextMenuCommand()) {
          const contextMenu = client.contextMenus.get(interaction.commandName);
          if (!contextMenu) return;

          try {
            await contextMenu.execute({ client, interaction, log });
          } catch (error: unknown) {
            if (error! instanceof Error) {
              console.error(error);
              await replyError(interaction);
            }
          }
        }

        break;
      default:
        break;
    }
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
