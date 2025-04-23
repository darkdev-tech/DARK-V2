const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
//            UPDATE BY DARK TECH        //
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

zokou({
  nomCom: "update",
  categorie: "General",
  reaction: "⬇️"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, msgAuteur } = commandeOptions;

  // Optional: Only allow the bot owner to run updates
  const ownerJID = "@s.whatsapp.net";
  if (msgAuteur !== ownerJID) {
    return repondre("⚠️ You are not authorized to update the bot!");
  }

  await repondre("⬇️ Pulling updates from GitHub...\nPlease wait a moment.");

  exec("git pull https://github.com/darkdev-tech/DARK-V2.git", async (err, stdout, stderr) => {
    if (err) {
      console.error("Update Error:", err);
      return repondre(`❌ Update failed:\n${stderr}`);
    }

    const result = `
✅ *Update Successful!*
\`\`\`
${stdout}
\`\`\`

🔁 Restart the bot to apply changes.
`;

    await zk.sendMessage(dest, { text: result }, { quoted: ms });
  });
});
