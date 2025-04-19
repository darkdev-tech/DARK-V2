// commands/boobs.js
const axios = require("axios");
const { zokou } = require("../lib/zokou");

zokou({
  nomCom: "boobs",
  categorie: "nsfw",
  reaction: "🍒",
  fromMe: false,
}, async (dest, zk, commandeOptions) => {
  const { ms, reply, isGroup } = commandeOptions;

  // Optional: Check NSFW mode for group (implement your JSON check here)
  const nsfwEnabled = true; // Replace with real logic if needed
  if (isGroup && !nsfwEnabled) {
    return reply("❌ NSFW commands are disabled in this group.");
  }

  try {
    const res = await axios.get("https://nekobot.xyz/api/image?type=boobs");
    const imageUrl = res.data.message;

    await zk.sendMessage(dest, { image: { url: imageUrl }, caption: "Here's your boobs pic 🍒" }, { quoted: ms });

  } catch (err) {
    console.error(err);
    reply("❌ Couldn't fetch NSFW content right now.");
  }
});
