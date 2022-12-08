import { ClientEvents, Awaitable } from "discord.js";
import BaeClient from "../extensions/BaeClient";

type LoggerFunction = (...args: unknown[]) => void;

export interface EventProperties {
  client: BaeClient;
  log: LoggerFunction;
}

export type EventKeys = keyof ClientEvents;

export type EventExec<T extends EventKeys> = (
  props: EventProperties,
  ...args: ClientEvents[T]
) => Awaitable<unknown>;
