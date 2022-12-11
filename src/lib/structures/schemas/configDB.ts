import { model, Schema } from "mongoose";

export default model(
  "config",
  new Schema({
    guildId: { type: String, required: true, unique: true },
    logging: {
      enabled: { type: Boolean, default: false },
      messageLogChannel: { type: String, default: null },
      modLogChannel: { type: String, default: null },
      travelLogChannel: { type: String, default: null },
      threadLogChannel: { type: String, default: null },
      userLogChannel: { type: String, default: null },
    },
    joinAge: {
      enabled: { type: Boolean, default: false },
      joinAge: { type: String, default: null },
    },
    blankAvatar: {
      enabled: { type: Boolean, default: false },
    },
    adminImmunity: {
      enabled: { type: Boolean, default: false },
    },
  })
);
