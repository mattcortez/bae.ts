let emojis = {
  success: "<:functionSucess:972554406824382505>",
  error: "<:functionError:972554416970399825>",
  warning: "<:systemWarn:978353079000920117>",
  cooldown: "<:messageTime:980535785084305458>",
  log: {
    ban: "<:logBan:1050335451912876043>",
    banRemove: "<:logBanRemove:1050335453154398208>",
    bypass: "<:logBypass:982492004153950258>",
    delete: "<:logDelete:982492005047365662>",
    guard: "<:logGuard:982492003134750790>",
    membershipJoin: "<:logMembershipJoin:982569985371156480>",
    membershipLeave: "<:logMembershipLeave:1050335454257496135>",
    membershipScreeningJoin: "<:logMembershipScreeningJoin:982492002002276353>",
    timeout: "<:logTimeout:1050335448838459444>",
    timeoutRemove: "<:logTimeoutRemove:1050335450709106698>",
  },
  config: {
    beta: "<:configBeta:1006281880074735646>",
    buttonOff: "<:configButtonOff:1005970996215431278>",
    buttonOn: "<:configButtonOn:1005970971355783198>",
    toggleOff: "<:configToggleOff:1005583615658303519>",
    toggleOn: "<:configToggleOn:1005583586281390080",
  },
};

let colors = {
  success: "#000000",
  error: "#000000",
  warning: "#000000",
  cooldown: "#000000",
  embed: {
    default: "#2f3136",
    error: "#000000",
  },
};

let regexes = {
  URL: /https?:\/\/([^\/?#]*)([^?#]*)(\?([^#]*))?(#(.*))?/gim,
  discord: {
    invite: /discord(?:app)?\.(?:com|gg)\/(?:invite\/)?(?<code>[\w-]{1,25})/gim,
    cdnEmoji:
      /^https?:\/\/cdn\.discordapp\.com\/emojis\/(\d{15,21})\.\w{3,4}(?:\?v=\d|\?size=\d{1,4})?/gim,
    cdnAttachment:
      /^https?:\/\/cdn\.discordapp\.com\/attachments\/\d{15,21}\/\d{15,21}\/\w*\.\w{3,4}/im,
    message:
      /(?:debug\.|ptb\.|canary\.|staging\.|lc\.)?(?:discord(?:app)?|inv|dscrd)\.(?:com?|wtf)?\/channels\/(?<guild_id>\d{15,21}|@me)\/(?<channel_id>\d{15,21})\/(?<message_id>\d{15,21})/im,
    messageGlobal:
      /<?(?<channel>debug\.|ptb\.|canary\.|staging\.)?discord(?:app)?\.com?\/channels\/(?<guild_id>\d{15,21})\/(?<channel_id>\d{15,21})\/(?<message_id>\d{15,21})>?/gim,
    webhook:
      /discord(?:app)?\.com\/api\/(?:v\d{1,2}\/)?webhooks\/(?<id>\d{15,21})\/(?<token>[\w-]{50,80})(?<thread>\?thread_id=(?<threadId>\d{15,21}))?/im,
  },
  invites: [
    /(?<domain>(?:dsc|dis|discord|invite)\.(?:gd|gg|io|me))\/(?<code>[\w-]+)/gim,
    /(?<domain>(?:discord(?:app)?|watchanimeattheoffice)\.com)\/(?:invites?|friend-invites?)\/(?<code>[\w-]+)/gim,
    /(?<domain>(?:h\.|i\.)?inv\.wtf)\/(?<code>[\w-]+)/gim,
  ],
  paypal: /(?:paypal\.me|paypal\.com\/paypalme)\/(?<name>[\w-]+)/im,
  youtube: {
    channel: /youtube\.com\/(?:c\/|channel\/|user\/)?(?<channel>[^"\s]+)/im,
    video:
      /(youtu\.be\/|invidio\.us\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/clip\/)(?<video>[\w-]+)/im,
  },
  twitch: {
    clip: /clips\.twitch\.tv\/(?<clip>\w+)/im,
    channel: /twitch\.tv\/(?<channel>.+)/im,
  },
  twitter:
    /twitter\.com\/(?<username>\w+)(?:\/status\/(?<tweet>\d+)?|\/(?<path>likes|media|with_replies|followers|following|suggested))?/im,
  imageURL:
    /((?:https:\/\/|http:\/\/)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*(?:\.png|\.jpg|\.jpeg|\.gif|\.gifv|\.webp)))/im,
};

export const constants = {
  emojis,
  colors,
  imageExts: [".png", ".jpg", ".jpeg", ".gif", ".gifv"],
  audioExts: ["mp3", "wav", "flac", "alac", "m4a"],
  videoExts: ["mp4", "mkv", "mov"],
  regexes,
};
