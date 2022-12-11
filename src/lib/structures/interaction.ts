import { InteractionExec } from "@bae/lib/types/interaction";
import { readdirSync } from "fs";
import BaeClient from "../extensions/BaeClient";
import chalk from "chalk";
import { PermissionResolvable } from "discord.js";
const asciiTable = require("ascii-table");

export default interface Interaction {
  name: string;
  permissions: PermissionResolvable[];
  execute: InteractionExec;
}

export async function registerInteractions(client: BaeClient): Promise<void> {
  const table = new asciiTable().setHeading("Interactions", "Folder", "Status");

  const folders = readdirSync(`${process.cwd()}/dist/interactions`);
  for (const folder of folders) {
    const files = readdirSync(
      `${process.cwd()}/dist/interactions/${folder}`
    ).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const {
        interaction,
      } = require(`${process.cwd()}/dist/interactions/${folder}/${file}`);

      client.interactions.set(interaction.name, interaction);

      table.addRow(file, folder, "✓");
      continue;
    }
  }

  return console.log(chalk.cyanBright(table.toString()));
}
