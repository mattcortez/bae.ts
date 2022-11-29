import {
  Client,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  PermissionResolvable,
} from "discord.js";

export interface Event {
  name: string;
  once?: boolean;
  rest?: boolean;
  execute: (...args: any[]) => any;
}

export interface Command extends ChatInputApplicationCommandData {
  developer?: boolean;
  botOwnerOnly?: boolean;
  botPermissions?: PermissionResolvable[];
  execute: (interaction: ChatInputCommandInteraction, client: Client) => any;
}
