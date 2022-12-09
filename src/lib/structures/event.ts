import { EventKeys, EventExec } from "../types/event";
import { readdirSync } from "fs";
import BaeClient from "../extensions/BaeClient";
import chalk from "chalk";
const asciiTable = require("ascii-table");

export default interface Event<T extends EventKeys> {
  id: T;
  once: boolean;
  execute: EventExec<T>;
}

export function registerEvents(client: BaeClient): void {
  const table = new asciiTable().setHeading("Events", "Folder", "Status");

  const folders = readdirSync(`${process.cwd()}/dist/events`);
  for (const folder of folders) {
    const files = readdirSync(`${process.cwd()}/dist/events/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of files) {
      const {
        event,
      } = require(`${process.cwd()}/dist/events/${folder}/${file}`);

      const props = {
        client,
        log: (...args: unknown[]) =>
          console.log(
            chalk.green(`[\`events/${folder}/\` ${event.id}]`),
            ...args
          ),
      };

      if (event.once) {
        client.once(event.id, async (...args) => {
          try {
            await event.execute(props, ...args);
          } catch (error) {
            props.log("Uncaught error", error);
          }
        });
      } else {
        client.on(event.id, async (...args) => {
          try {
            await event.execute(props, ...args);
          } catch (error) {
            props.log("Uncaught error", error);
          }
        });
      }

      table.addRow(file, folder, "✓");
    }
  }
  return console.log(chalk.cyan(table.toString()));
}
