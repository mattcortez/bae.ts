import {
  Awaitable,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from "discord.js";
import BaeClient from "../extensions/BaeClient";

// {
//   name: "commandName",
//   description: "commandDescription",
//   developer?: true,
//   cooldown: 5000,
//   async (client, message) => {
//     code here
//   }
// }

type LoggerFunction = (...args: unknown[]) => void;

export interface ICommandProperties {
  client: BaeClient;
  interaction: ChatInputCommandInteraction;
  log: LoggerFunction;
  args?: CommandInteractionOptionResolver;
}

type CommandFunction = (props: ICommandProperties) => Awaitable<unknown>;

export interface ICommandOptions {
  name: string;
  description: string;
  developer?: boolean;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  cooldown: number;
  run: CommandFunction;
}
