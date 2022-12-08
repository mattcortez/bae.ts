import { Client, ClientOptions, Collection } from "discord.js";
import config from "@bae/lib/utils/dotenv";
import { ICommandOptions } from "@bae/lib/types/command";
import { registerEvents } from "@bae/lib/structures/event";

export default class BaeClient extends Client {
  commands: Collection<string, ICommandOptions> = new Collection();
  events: Collection<string, Event> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
    console.log("Starting up the bot");
  }

  start() {
    this.login(config.CLIENT_TOKEN)
      .then(() => {
        registerEvents(this);
      })
      .catch((err) => console.log(err));
  }
}
