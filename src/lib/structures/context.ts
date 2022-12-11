import { ContextMenuCommandBuilder, PermissionResolvable } from "discord.js";
import { ContextMenuExec } from "@bae/lib/types/context";
import { readdirSync } from "fs";
import BaeClient from "../extensions/BaeClient";
import chalk from "chalk";
const asciiTable = require("ascii-table");

export default interface ContextMenu {
  options: ContextMenuCommandBuilder;
  global: Boolean;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  cooldown: number;
  execute: ContextMenuExec;
}

export async function registerContextMenus(client: BaeClient): Promise<void> {
  const table = new asciiTable().setHeading(
    "Context Menus",
    "Folder",
    "Status"
  );

  const folders = readdirSync(`${process.cwd()}/dist/context`);
  for (const folder of folders) {
    const files = readdirSync(`${process.cwd()}/dist/context/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of files) {
      const {
        contextMenu,
      } = require(`${process.cwd()}/dist/context/${folder}/${file}`);

      client.contextMenus.set(contextMenu.options.name, contextMenu);

      table.addRow(file, folder, "✓");
      continue;
    }
  }

  return console.log(chalk.cyanBright(table.toString()));
}
