const { zokou } = require("../framework/zokou");
const fs = require("fs");
const path = require("path");

// You can save mode to a JSON file (for persistence)
const settingsPath = path.join(__dirname, "../database/settings.json");
let botSettings = fs.existsSync(settingsPath)
  ? JSON.parse(fs.readFileSync(settingsPath))
  : { mode: "public" };

// Update mode persistently
const setMode = (mode) => {
  botSettings.mode = mode;
  fs.writeFileSync(settingsPath, JSON.stringify(botSettings, null, 2));
};

zokou({
  nomCom: "mode",
  desc: "Change bot mode: public, private or self",
  categorie: "Owner",
  reaction: "🛠️",
  fromMe: true
}, async (dest, zk, { arg, repondre }) => {
  const mode = arg[0]?.toLowerCase();

  if (!mode || !["public", "private", "self"].includes(mode)) {
    return repondre("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐦𝐨𝐝𝐞.\n\n✅ 𝐔𝐬𝐚𝐠𝐞: /mode public|private|self");
  }

  setMode(mode);

  await repondre(`✅ 𝐁𝐨𝐭 𝐦𝐨𝐝𝐞 𝐬𝐞𝐭 𝐭𝐨: *${mode.toUpperCase()}*`);
});

// Access mode anywhere in your bot using:
global.botMode = botSettings.mode;
