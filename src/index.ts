import "module-alias/register";
import BaeClient from "@bae/lib/extensions/BaeClient";
import { clientOptions } from "@bae/setup";

// Initialize the client
const client = new BaeClient(clientOptions);

client.start();
