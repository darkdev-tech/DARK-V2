const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const nsfwPath = path.join(__dirname, "../database/nsfw.json");
let nsfw = fs.existsSync(nsfwPath) ? JSON.parse(fs.readFileSync(nsfwPath)) : { nsfw: false };

zokou({
  nomCom: "gifporn",
  desc: "Send a random NSFW GIF",
  categorie: "NSFW",
  reaction: "🔁",
  fromMe: false
}, async (dest, zk, { repondre, ms }) => {
  if (!nsfw.nsfw) {
    return repondre("🔒 NSFW mode is OFF. Use /porn on to enable.");
  }

  try {
    const loading = await repondre("🔁 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐍𝐒𝐅𝐖 𝐆𝐈𝐅...");
    const res = await axios.get("https://fantox-apis.vercel.app/porn-gif");
    const gifUrl = res.data.url;

    await zk.sendMessage(dest, {
      video: { url: gifUrl },
      caption: "🔞 𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐥𝐨𝐨𝐩..."
    }, { quoted: ms });

  } catch (error) {
    console.error("NSFW GIF error:", error);
    repondre("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐆𝐈𝐅.");
  }
});
