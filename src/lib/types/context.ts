import { Awaitable, ContextMenuCommandInteraction } from "discord.js";
import BaeClient from "../extensions/BaeClient";

type LoggerFunction = (...args: unknown[]) => void;

export interface ContextMenuProperties {
  client: BaeClient;
  interaction: ContextMenuCommandInteraction;
  log: LoggerFunction;
}

export type ContextMenuExec = (
  props: ContextMenuProperties
) => Awaitable<unknown>;
