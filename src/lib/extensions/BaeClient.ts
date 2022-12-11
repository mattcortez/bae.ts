import { Client, ClientOptions, Collection } from "discord.js";
import config from "@bae/lib/utils/dotenv";
import Command, { registerCommands } from "@bae/lib/structures/command";
import ContextMenu, { registerContextMenus } from "@bae/lib/structures/context";
import Event, { registerEvents } from "@bae/lib/structures/event";
import Interaction, {
  registerInteractions,
} from "@bae/lib/structures/interaction";
import chalk from "chalk";

export default class BaeClient extends Client {
  commands: Collection<string, Command> = new Collection();
  events: Collection<string, Event<any>> = new Collection();
  contextMenus: Collection<string, ContextMenu> = new Collection();
  interactions: Collection<string, Interaction> = new Collection();
  cooldowns: Collection<string, number> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
    console.log(chalk.bold.blueBright("Starting up the bot..."));
  }

  start() {
    this.login(config.CLIENT_TOKEN)
      .then(() => {
        registerEvents(this);
        registerCommands(this);
        registerContextMenus(this);
        registerInteractions(this);
      })
      .catch((err) => console.log(err));
  }
}
