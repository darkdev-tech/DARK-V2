const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

function getCurrentTimeInNairobi() {
  return moment().tz('Africa/Nairobi').format('hh:mm:ss A');
}

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
  let { ms, repondre, prefixe, m, mybotpic } = commandeOptions;
  let { cm } = require(__dirname + "/../framework/zokou");

  let coms = {};
  let mode = s.MODE.toLowerCase() === "yes" ? "🟢 Public" : "🔒 Private";
  let Rspeed = Math.random() * (0.05 - 0.01) + 0.01;

  cm.map((com) => {
    if (!coms[com.categorie]) coms[com.categorie] = [];
    coms[com.categorie].push(com.nomCom);
  });

  moment.tz.setDefault(s.TZ || 'Africa/Nairobi');
  const date = new Date();

  let header = `
╭═════〘 𝐃𝐀𝐑𝐊 𝐌𝐃 𝐕𝟐 〙═════╮
┃✫╭═─────────────────═╮
┃✬│ 𝗨𝘀𝗲𝗿 : ${m.pushName}
┃✫│ 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefixe}
┃✫│ 𝗠𝗼𝗱𝗲 : ${mode}
┃✯│ 𝗦𝗽𝗲𝗲𝗱 : ${Rspeed.toFixed(4)} 𝗠𝘀
┃✬│ 𝗧𝗶𝗺𝗲 : ${getCurrentTimeInNairobi()} on ${date.toLocaleString('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi' })}
┃✫│ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗥𝗔𝗠 : 32𝗚𝗕 𝗼𝗳 64𝗚𝗕
┃✫│═════════════════════
┃✬│  𝐌𝐀𝐃𝐄 𝐁𝐘 : 𓆩DARK TECH𓆪
┃✬│ DARK TECH 『Team』
┃✫│  █■█■█■█■█■█■█■█■█■█
┃✫│═════════════════════
╰══⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊══╯

${readmore}
╭═════〘 𝐃𝐀𝐑𝐊 𝐌𝐃 𝐕2 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 〙═════╮ `;

  let body = "";

  for (const cat in coms) {
    body += `\n\n●═══    〘 *${cat.toUpperCase()}* 〙  ══●`;
    for (const cmd of coms[cat]) {
      body += `\n│✧ ${prefixe}${cmd}`;
    }
    body += `\n╰────────────────────────────╯`;
  }

  let footer = `
 ●═══ 〘 © 2025 DARK TECH 〙 ══●
┃  Built with love by DARK_TECH
╰═══════════════════════╯`;

  const caption = header + body + footer;
  const media = mybotpic();

  try {
    if (media.match(/.(mp4|gif)$/i)) {
      await zk.sendMessage(dest, {
        video: { url: media },
        caption: caption,
        gifPlayback: true
      }, { quoted: ms });
    } else if (media.match(/.(jpg|jpeg|png)$/i)) {
      await zk.sendMessage(dest, {
        image: { url: media },
        caption: caption
      }, { quoted: ms });
    } else {
      repondre(caption);
    }
  } catch (e) {
    console.error("[MENU ERROR]", e);
    repondre("⚠️ Error displaying menu.");
  }
});
