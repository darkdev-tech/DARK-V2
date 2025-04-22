const { zokou } = require("../framework/zokou");
const axios = require("axios"); // Use axios for API requests

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
//                   𝐒𝐄𝐀𝐑𝐂𝐇 𝐌𝐎𝐃𝐔𝐋𝐄                 //
//               𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐑𝐊-𝐌𝐃                //
//             𝐎𝐰𝐧𝐞𝐫: 𝐃𝐀𝐑𝐊 𝐓𝐄𝐂𝐇                 //
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

zokou(
  {
    nomCom: "xlyrics",
    categorie: "Search",
    reaction: "🍁",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, arg } = commandeOptions;

    try {
      if (!arg || arg.length === 0) {
        return repondre(
          `🔍 Example: ${prefixe}xlyrics Shape of You\n\nPlease provide a song name to search for lyrics!`
        );
      }

      const searchTerm = arg.join(" ");
      await repondre(`🔄 Searching for lyrics of "${searchTerm}"...`);

      // Fetch lyrics using the API
      const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(searchTerm)}`);
      const lyrics = response.data.lyrics;

      if (lyrics) {
        // Format response
        const lyricsText = `
◈━━━━━━━━━━━━━━━━◈
  ⚡️ Lyrics Search Engine ⚡️

🎵 Song: *${searchTerm}*

📜 Lyrics:

${lyrics}

◈━━━━━━━━━━━━━━━━◈
Powered by DARK-MD
Owner: DARK_TECH
`;

        // Send response
        await zk.sendMessage(
          dest,
          {
            text: lyricsText,
          },
          { quoted: ms }
        );
      } else {
        repondre(`❌ No lyrics found for "${searchTerm}". Please try another song.`);
      }
    } catch (error) {
      console.error("Lyrics error:", error);
      repondre(`❌ Error fetching lyrics: ${error.message}`);
    }
  }
);
