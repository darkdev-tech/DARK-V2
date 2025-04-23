const { zokou } = require("../framework/zokou");
const axios = require("axios");

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
//              XLYRICS BY DARK TECH     //
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

zokou({
  nomCom: "xlyrics",
  categorie: "Search",
  reaction: "🎶"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, prefixe, arg } = commandeOptions;

  if (!arg || arg.length === 0) {
    return repondre(`❗ *Example:* ${prefixe}xlyrics Shape of You\n\nPlease provide a song name.`);
  }

  const song = arg.join(" ");
  await repondre(`🔍 Searching for *${song}* lyrics...`);

  try {
    const res = await axios.get(`https://some-random-api.com/lyrics?title=${encodeURIComponent(song)}`);
    const data = res.data;

    if (!data || !data.lyrics) {
      return repondre(`❌ No lyrics found for *${song}*.`);
    }

    const text = `
╭─❖「 *LYRICS FOUND* 」❖─╮
│ 🎵 *Title:* ${data.title}
│ 🎤 *Artist:* ${data.author}
│ 
│ ${data.lyrics.substring(0, 4000)}
╰─────────────────────╯

⚡ Powered by DARK-MD
`;

    await zk.sendMessage(dest, { text }, { quoted: ms });

  } catch (e) {
    console.error("Lyrics Error:", e.message);
    repondre(`❌ Failed to fetch lyrics.\nMake sure the song name is valid.`);
  }
});
