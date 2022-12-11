import { Client, ClientOptions, Collection } from "discord.js";
import config from "@bae/lib/utils/dotenv";
import Command, { registerCommands } from "@bae/lib/structures/command";
import ContextMenu, { registerContextMenus } from "@bae/lib/structures/context";
import { registerEvents } from "@bae/lib/structures/event";

export default class BaeClient extends Client {
  commands: Collection<string, Command> = new Collection();
  // events: Collection<string, Event> = new Collection();
  contextMenus: Collection<string, ContextMenu> = new Collection();
  cooldowns: Collection<string, number> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
    console.log("Starting up the bot...");
  }

  start() {
    this.login(config.CLIENT_TOKEN)
      .then(() => {
        registerEvents(this);
        registerCommands(this);
        registerContextMenus(this);
      })
      .catch((err) => console.log(err));
  }
}
