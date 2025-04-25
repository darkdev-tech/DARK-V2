const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "restart",
    categorie: "Mods",
    reaction: "📴",
  },
  async (dest, z, com) => {
    const { repondre, superUser } = com;

    if (!superUser) {
      return repondre("⚠️ *ACCESS DENIED!*\n\nOnly *DARK-MD V2* owners can use this command.");
    }

    const { exec } = require("child_process");

    await repondre(
      `🔄 *DARK-MD V2 SYSTEM REBOOT INITIATED...*\n\n` +
      `⚙️ Restarting bot engine via *PM2*\n` +
      `⏳ Please wait a moment...`
    );

    exec("pm2 restart all", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Restart Error: ${error.message}`);
        return repondre("❌ *Restart failed!*\nCheck logs for more details.");
      }
      if (stderr) {
        console.error(`⚠️ STDERR: ${stderr}`);
        return;
      }

      console.log(`✅ Restart Log: ${stdout}`);
    });
  }
);
