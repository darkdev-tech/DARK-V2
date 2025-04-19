const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const nsfwPath = path.join(__dirname, "../database/nsfw.json");
let nsfw = fs.existsSync(nsfwPath) ? JSON.parse(fs.readFileSync(nsfwPath)) : { nsfw: false };

zokou({
  nomCom: "pornvid",
  desc: "Send a random porn video",
  categorie: "NSFW",
  reaction: "🔞",
  fromMe: false
}, async (dest, zk, { repondre, ms }) => {
  if (!nsfw.nsfw) {
    return repondre("🔒 NSFW mode is OFF. Use /porn on to enable.");
  }

  try {
    const loading = await repondre("🔞 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐚 𝐬𝐭𝐞𝐚𝐦𝐲 𝐜𝐥𝐢𝐩...");

    const res = await axios.get("https://fantox-apis.vercel.app/pornvid");
    const videoUrl = res.data.url;

    await zk.sendMessage(dest, {
      video: { url: videoUrl },
      caption: `🔥 𝐑𝐚𝐧𝐝𝐨𝐦 𝐏𝐨𝐫𝐧 𝐕𝐢𝐝𝐞𝐨\n\n❗ 𝐒𝐚𝐟𝐞 𝐓𝐨 𝐔𝐬𝐞 𝐈𝐧 𝐍𝐒𝐅𝐖 𝐌𝐨𝐝𝐞`
    }, { quoted: ms });

  } catch (error) {
    console.error("Porn video error:", error);
    await repondre("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐠𝐞𝐭 𝐯𝐢𝐝𝐞𝐨.");
  }
});
