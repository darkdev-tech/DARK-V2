const { zokou } = require("../framework/zokou");
const fs = require("fs");
const path = require("path");

const banPath = path.join(__dirname, "../database/banlist.json");
let banList = fs.existsSync(banPath) ? JSON.parse(fs.readFileSync(banPath)) : [];

const saveBanList = () => fs.writeFileSync(banPath, JSON.stringify(banList, null, 2));

zokou({
  nomCom: "banuser",
  desc: "Globally ban a user",
  categorie: "Owner",
  reaction: "🚫",
  fromMe: true
}, async (dest, zk, { ms, arg, repondre }) => {
  let target = arg[0] || (ms.quoted ? ms.quoted.sender : null);

  if (!target) return repondre("❌ 𝐒𝐞𝐧𝐝 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 𝐨𝐫 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐮𝐬𝐞𝐫.");

  if (!target.includes("@s.whatsapp.net")) target = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  if (banList.includes(target)) return repondre("❗ 𝐔𝐬𝐞𝐫 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐛𝐚𝐧𝐧𝐞𝐝.");

  banList.push(target);
  saveBanList();

  await repondre(`✅ 𝐁𝐚𝐧𝐧𝐞𝐝: @${target.split("@")[0]}`, { mentions: [target] });
});

// In your message handler, block commands from banned users:
global.isUserBanned = (jid) => banList.includes(jid);
