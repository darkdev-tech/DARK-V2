const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou(
  {
    nomCom: 'alive',
    categorie: 'General',
    reaction: "⚡"
  },
  async (dest, zk, { ms, arg, repondre, superUser }) => {
    const data = await getDataFromAlive();
    const mode = (s.MODE.toLowerCase() === "yes") ? "🌍 Public" : "🔒 Private";
    const time = moment().tz('Etc/GMT').format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    if (!arg || !arg[0]) {
      if (data) {
        const { message, lien } = data;

        const aliveMsg = `
╭══════⊷ *DARK-MD V2 SYSTEM* ⊶══════╮
┃ ⚡ *Status:* 𝗔𝗟𝗜𝗩𝗘 & 𝗢𝗡𝗟𝗜𝗡𝗘
┃ 👑 *Owner:* ${s.OWNER_NAME}
┃ 🌐 *Mode:* ${mode}
┃ 📅 *Date:* ${date}
┃ ⏰ *Time (GMT):* ${time}
┃────────────────────────────
┃ ${message || "No custom message set. Use: *alive [msg];[link]*"}
╰══════════════════════════════╯
✨ Powered by *DARK TECH*
        `.trim();

        try {
          if (lien) {
            if (/\.(mp4|gif)$/i.test(lien)) {
              await zk.sendMessage(dest, {
                video: { url: lien },
                caption: aliveMsg
              }, { quoted: ms });
            } else if (/\.(jpeg|jpg|png)$/i.test(lien)) {
              await zk.sendMessage(dest, {
                image: { url: lien },
                caption: aliveMsg
              }, { quoted: ms });
            } else {
              repondre(aliveMsg);
            }
          } else {
            repondre(aliveMsg);
          }
        } catch (e) {
          console.error("Alive send error:", e);
          repondre("❌ Failed to send alive message. Please check the media link.");
        }

      } else {
        if (!superUser) {
          return repondre("✅ *DARK-MD V2 is up and running smoothly!*");
        }
        return repondre("⚙️ Use *alive [message];[media link]* to set a custom alive message.");
      }
    } else {
      if (!superUser) {
        return repondre("🚫 *Only the DARK-MD V2 owner can update this!*");
      }

      const [texte, tlien] = arg.join(' ').split(';');
      await addOrUpdateDataInAlive(texte, tlien);
      repondre("✅ *Alive message updated successfully!*");
    }
  }
);
