import { model, Schema } from "mongoose";

export default model(
  "config",
  new Schema({
    guildId: { type: String, required: true, unique: true },
    logging: {
      currentSelect: { type: String, default: null },
      enabled: { type: Boolean, default: false },
      moderationChannel: { type: String, default: null },
      messageChannel: { type: String, default: null },
      threadChannel: { type: String, default: null },
      travelChannel: { type: String, default: null },
      userChannel: { type: String, default: null },
      reportsChannel: { type: String, default: null },
    },
    moderation: {
      enabled: { type: Boolean, default: false },
      adminImmunity: {
        enabled: { type: Boolean, default: false },
      },
      bypassRole: { type: String, default: null },
      joinAge: { type: String, default: null },
      noBlankAvatar: {
        enabled: { type: Boolean, default: false },
      },
    },
    features: {
      messageLinkPreview: {
        enabled: { type: Boolean, default: false },
      },
      messageLeaderboard: {
        enabled: { type: Boolean, default: false },
      },
    },
  })
);
