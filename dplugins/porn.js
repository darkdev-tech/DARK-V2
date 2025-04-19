const axios = require("axios");
const { zokou } = require("../lib/zokou");

zokou({ 
  nomCom: "porn", 
  categorie: "nsfw", 
  reaction: "🔞", 
  fromMe: false 
}, async (dest, zk, commandeOptions) => {
  const { ms, arg, reply, isGroup, groupMetadata, botNumberJid, superUser, prefix, commandName, pushName, mime } = commandeOptions;

  // Optional NSFW check
  if (isGroup) {
    const nsfwEnabled = true; // Replace with a real group setting check
    if (!nsfwEnabled) {
      return reply("❌ NSFW commands are disabled in this group.");
    }
  }

  try {
    const res = await axios.get("https://nekobot.xyz/api/image?type=pgif");
    const imageUrl = res.data.message;

    await zk.sendMessage(dest, { image: { url: imageUrl }, caption: "Here you go... 🔞" }, { quoted: ms });

  } catch (err) {
    console.error(err);
    reply("❌ Failed to fetch NSFW content.");
  }
});
