import Event from "@bae/lib/structures/event";
import { ActivityType } from "discord.js";
import mongoose from "mongoose";
import config from "@bae/lib/utils/dotenv";
import chalk from "chalk";
import deploy from "@bae/lib/structures/deploy";

export const event: Event<any> = {
  id: "ready",
  once: true,
  execute: async ({ log }, client) => {
    // Presence
    function presence() {
      client.user.setPresence({
        activities: [
          {
            name: `${client.users.cache.size} users!`,
            type: ActivityType.Watching,
          },
        ],
        status: "online",
      });
    }
    setInterval(presence, 30000);

    log(chalk.green(`Logged in as ${client.user?.tag}`));

    if (!config.MONGO_URI) return;
    mongoose
      .connect(config.MONGO_URI)
      .then(() => {
        console.log(chalk.yellow("Connected to the database!"));
      })
      .catch((err) => {
        console.log(err);
      });

    deploy(client);
  },
};
