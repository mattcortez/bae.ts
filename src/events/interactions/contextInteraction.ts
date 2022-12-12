import {
  bold,
  Collection,
  EmbedBuilder,
  HexColorString,
  Interaction,
  InteractionType,
  PermissionsBitField,
  RepliableInteraction,
} from "discord.js";
import Event from "@bae/lib/structures/event";
import { constants } from "@bae/lib/utils/constants";
import ms from "ms";

const { emojis, colors } = constants;

export const event: Event<any> = {
  id: "interactionCreate",
  once: false,
  execute: async ({ log, client }, interaction: Interaction) => {
    const cooldowns: Collection<string, number> = client.cooldowns;

    if (!InteractionType.ApplicationCommand) return;
    if (!interaction.isContextMenuCommand()) return;
    log("Context menu command detected");

    const contextMenu = client.contextMenus.get(interaction.commandName);
    if (!contextMenu)
      return client.contextMenus.delete(interaction.commandName);

    try {
      if (!contextMenu.cooldown) {
        if (contextMenu.userPermissions || contextMenu.botPermissions) {
          if (
            !interaction.memberPermissions?.has(
              PermissionsBitField.resolve(contextMenu.userPermissions || [])
            )
          ) {
            const content = bold(
              `${emojis.error} You do not have ${contextMenu.userPermissions} permissions to use this command!`
            );
            const userPermsEmbed = new EmbedBuilder()
              .setColor(colors.embed.default as HexColorString)
              .setDescription(content);
            return interaction.reply({
              embeds: [userPermsEmbed],
              ephemeral: true,
            });
          }
          if (client.user?.id === undefined) return;
          if (
            !interaction.guild?.members.cache
              .get(client.user?.id)
              ?.permissions.has(
                PermissionsBitField.resolve(contextMenu.botPermissions || [])
              )
          ) {
            const content = bold(
              `${emojis.error} I do not have ${contextMenu.botPermissions} permissions to execute this command!`
            );
            const botPermsEmbed = new EmbedBuilder()
              .setColor(colors.embed.default as HexColorString)
              .setDescription(content);
            return interaction.reply({
              embeds: [botPermsEmbed],
              ephemeral: true,
            });
          }
        }
        await contextMenu.execute({ client, interaction, log });
      }

      if (contextMenu.cooldown) {
        if (
          cooldowns.has(
            `slash-${contextMenu.options.name}${interaction.user.id}`
          )
        ) {
          const getCooldown = cooldowns.get(
            `slash-${contextMenu.options.name}${interaction.user.id}`
          );
          if (getCooldown === undefined) return;
          const cooldownTime = ms(getCooldown - Date.now(), { long: true });
          const content = bold(
            `${emojis.cooldown} You are on ${cooldownTime} cooldown!`
          );
          const cooldownEmbed = new EmbedBuilder()
            .setColor(colors.embed.default as HexColorString)
            .setDescription(content);
          return interaction.reply({
            embeds: [cooldownEmbed],
            ephemeral: true,
          });
        }

        if (contextMenu.userPermissions || contextMenu.botPermissions) {
          if (
            !interaction.memberPermissions?.has(
              PermissionsBitField.resolve(contextMenu.userPermissions || [])
            )
          ) {
            const content = bold(
              `${emojis.error} You do not have ${contextMenu.userPermissions} permissions to use this command!`
            );
            const userPermsEmbed = new EmbedBuilder()
              .setColor(colors.embed.default as HexColorString)
              .setDescription(content);
            return interaction.reply({
              embeds: [userPermsEmbed],
              ephemeral: true,
            });
          }
          if (client.user?.id === undefined) return;
          if (
            !interaction.guild?.members.cache
              .get(client.user?.id)
              ?.permissions.has(
                PermissionsBitField.resolve(contextMenu.botPermissions || [])
              )
          ) {
            const content = bold(
              `${emojis.error} I do not have ${contextMenu.botPermissions} permissions to execute this command!`
            );
            const botPermsEmbed = new EmbedBuilder()
              .setColor(colors.embed.default as HexColorString)
              .setDescription(content);
            return interaction.reply({
              embeds: [botPermsEmbed],
              ephemeral: true,
            });
          }
        }
        await contextMenu.execute({ client, interaction, log });
        cooldowns.set(
          `slash-${contextMenu.options.name}${interaction.user.id}`,
          Date.now() + contextMenu.cooldown
        );
        setTimeout(() => {
          cooldowns.delete(
            `slash-${contextMenu.options.name}${interaction.user.id}`
          );
        }, contextMenu.cooldown);
      }
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
      content: `${bold(
        `${emojis.error} There was an error while executing this interaction.`
      )}`,
      ephemeral: true,
    })
    .catch(console.error);
}
