import { bold, Collection, EmbedBuilder, HexColorString, Interaction, InteractionType, PermissionsBitField, RepliableInteraction } from "discord.js";
import Event from "@bae/lib/structures/event";
import { constants } from "@bae/lib/utils/constants";
import ms from "ms"

const { emojis, colors } = constants
//const cooldown: Collection<string, number> = new Collection()

export const event: Event<any> = {
  id: "interactionCreate",
  once: false,
  execute: async ({ log, client }, interaction: Interaction) => {
    log('Interaction detected')
    const cooldowns: Collection<string, number> = client.cooldowns
  
    
    if (!InteractionType.ApplicationCommand) return;
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName)
    if (!command) return client.commands.delete(interaction.commandName);

    try {

      if (!command.cooldown) {
        if (command.userPermissions || command.botPermissions) {
          if (!interaction.memberPermissions?.has(PermissionsBitField.resolve(command.userPermissions || []))) {
            const content = bold(`${emojis.error} You do not have ${command.userPermissions} permissions to use this command!`)
            const userPermsEmbed = new EmbedBuilder()
            .setColor(colors.default as HexColorString)
            .setDescription(content)
            return interaction.reply({ embeds: [userPermsEmbed], ephemeral: true})
          }
          if (client.user?.id === undefined) return;
          if (!interaction.guild?.members.cache.get(client.user?.id)?.permissions.has(PermissionsBitField.resolve(command.botPermissions || []))) {
            const content = bold(`${emojis.error} You do not have ${command.userPermissions} permissions to use this command!`)
            const botPermsEmbed = new EmbedBuilder()
            .setColor(colors.default as HexColorString)
            .setDescription(content)
            return interaction.reply({ embeds: [botPermsEmbed], ephemeral: true})
          }
        }
        await command.execute({client, interaction, log})
      }

      if(command.cooldown) {
        if (cooldowns.has(`slash-${command.options.name}${interaction.user.id}`)) {
          const getCooldown = cooldowns.get(`slash-${command.options.name}${interaction.user.id}`)
          if (getCooldown === undefined) return;
          const cooldownTime = ms(getCooldown - Date.now(), { long: true })
          const content = bold(`${emojis.cooldown} You are on ${cooldownTime} cooldown!`)
          const cooldownEmbed = new EmbedBuilder()
          .setColor(colors.default as HexColorString)
          .setDescription(content)
          return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true})
        }

        if (command.userPermissions || command.botPermissions) {
          if(!interaction.memberPermissions?.has(PermissionsBitField.resolve(command.userPermissions || []))) {
          const content = bold(`${emojis.error} You do not have ${command.userPermissions} permissions to use this command!`)
          const userPermsEmbed = new EmbedBuilder()
          .setColor(colors.default as HexColorString)
          .setDescription(content)
          return interaction.reply({ embeds: [userPermsEmbed], ephemeral: true})
          }
          if (client.user?.id === undefined) return;
          if (!interaction.guild?.members.cache.get(client.user?.id)?.permissions.has(PermissionsBitField.resolve(command.botPermissions || []))) {
            const content = bold(`${emojis.error} You do not have ${command.userPermissions} permissions to use this command!`)
            const botPermsEmbed = new EmbedBuilder()
            .setColor(colors.default as HexColorString)
            .setDescription(content)
            return interaction.reply({ embeds: [botPermsEmbed], ephemeral: true})
          }

        }
        await command.execute({client, interaction, log});
					cooldowns.set(`slash-${command.options.name}${interaction.user.id}`, Date.now() + command.cooldown)
					setTimeout(() => {
							cooldowns.delete(`slash-${command.options.name}${interaction.user.id}`)
					}, command.cooldown)





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
      content: "There was an error while executing this interaction.",
      ephemeral: true,
    })
    .catch(console.error);
}
