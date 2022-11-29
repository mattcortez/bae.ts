import { Client, ClientOptions, Collection } from "discord.js";
import config from "@utils/dotenv";
import { CommandType } from "@bae/types/command";

export class BaeClient extends Client {
  commands: Collection<string, CommandType> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
  }

  start() {
    this.login(config.CLIENT_TOKEN);
  }
}
