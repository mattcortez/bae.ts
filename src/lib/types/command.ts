import { Awaitable, ChatInputCommandInteraction } from "discord.js";
import BaeClient from "../extensions/BaeClient";

type LoggerFunction = (...args: unknown[]) => void;

export interface CommandProperties {
  client: BaeClient;
  interaction: ChatInputCommandInteraction;
  log: LoggerFunction;
}

export type CommandExec = (props: CommandProperties) => Awaitable<unknown>;
