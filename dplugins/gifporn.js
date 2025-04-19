const axios = require("axios");
const { zokou } = require("../lib/zokou");

zokou({
  nomCom: "gifporn",
  categorie: "nsfw",
  reaction: "🔥",
  fromMe: false,
}, async (dest, zk, commandeOptions) => {
  const { ms, reply, isGroup } = commandeOptions;

  // Optional: Check NSFW mode for groups (add JSON or DB check here)
  const nsfwEnabled = true; // Replace with real group setting logic
  if (isGroup && !nsfwEnabled) {
    return reply("❌ NSFW commands are disabled in this group.");
  }

  try {
    const res = await axios.get("https://nekobot.xyz/api/image?type=pgif");
    const gifUrl = res.data.message;

    await zk.sendMessage(dest, { video: { url: gifUrl }, gifPlayback: true, caption: "Enjoy your NSFW GIF 🔥" }, { quoted: ms });

  } catch (err) {
    console.error(err);
    reply("❌ Failed to fetch NSFW GIF.");
  }
});
