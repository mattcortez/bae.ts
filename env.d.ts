declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_TOKEN: string;
      CLIENT_ID: string;
      GUILD_ID: string;
      DEV_GUILD_ID: string;
      MONGO_URI: string;
    }
  }
}

export {};
