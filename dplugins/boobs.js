zokou({
  nomCom: "boobs",
  desc: "Random boobs image",
  categorie: "NSFW",
  reaction: "🍒",
  fromMe: false
}, async (dest, zk, { repondre, ms }) => {
  if (!nsfw.nsfw) return repondre("🔒 NSFW mode is OFF. Use /porn on to enable.");

  try {
    const res = await axios.get("https://fantox-apis.vercel.app/boobs");
    await zk.sendMessage(dest, {
      image: { url: res.data.url },
      caption: "🍒 Here's a juicy one..."
    }, { quoted: ms });
  } catch (err) {
    console.error(err);
    repondre("❌ Failed to fetch image.");
  }
});
