import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  PermissionResolvable,
} from "discord.js";
import { CommandExec } from "@bae/lib/types/command";
import { readdirSync } from "fs";
import BaeClient from "../extensions/BaeClient";
import chalk from "chalk";
const asciiTable = require("ascii-table");

export default interface Command {
  options:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  global: boolean;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  cooldown: number;
  execute: CommandExec;
}

export async function registerCommands(client: BaeClient): Promise<void> {
  const table = new asciiTable().setHeading("Commands", "Folder", "Status");

  const folders = readdirSync(`${process.cwd()}/dist/commands`);
  for (const folder of folders) {
    const files = readdirSync(
      `${process.cwd()}/dist/commands/${folder}`
    ).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const {
        command,
      } = require(`${process.cwd()}/dist/commands/${folder}/${file}`);

      client.commands.set(command.options.name, command);

      table.addRow(file, folder, "✓");
      continue;
    }
  }

  return console.log(chalk.red(table.toString()));
}
