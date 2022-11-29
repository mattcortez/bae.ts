import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const { CLIENT_TOKEN, CLIENT_ID, GUILD_ID, DEV_GUILD_ID, MONGO_URI } =
  process.env;

if (!CLIENT_TOKEN || !CLIENT_ID || !GUILD_ID || !DEV_GUILD_ID || !MONGO_URI) {
  throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
  CLIENT_TOKEN,
  CLIENT_ID,
  GUILD_ID,
  DEV_GUILD_ID,
  MONGO_URI,
};

export default config;
