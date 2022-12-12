import {
  AnySelectMenuInteraction,
  Awaitable,
  ButtonInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import BaeClient from "../extensions/BaeClient";

type LoggerFunction = (...args: unknown[]) => void;

export interface InteractionProperties {
  client: BaeClient;
  interaction:
    | ButtonInteraction
    | ModalSubmitInteraction
    | AnySelectMenuInteraction;
  log: LoggerFunction;
}

export type InteractionExec = (
  props: InteractionProperties
) => Awaitable<unknown>;
