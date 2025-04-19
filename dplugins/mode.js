const { zokou } = require("../lib/zokou");
const config = require("../lib/config");

let botMode = "public"; // Can be moved to JSON or .env

zokou({ 
  nomCom: "mode", 
  categorie: "system", 
  reaction: "⚙️", 
  fromMe: true 
}, async (dest, zk, commandeOptions) => {
  const { ms, arg, reply } = commandeOptions;
  const mode = arg[0]?.toLowerCase();

  if (!["public", "private"].includes(mode)) {
    return reply("Usage: mode public / mode private");
  }

  botMode = mode;
  reply(`✅ Bot mode switched to *${botMode}*`);
});

// Export current mode if needed elsewhere
module.exports = { getBotMode: () => botMode };
