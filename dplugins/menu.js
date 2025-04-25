const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou");

    let coms = {};
    cm.forEach(com => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    const mode = s.MODE.toLowerCase() === "yes" ? "🟢 Public" : "🔒 Private";
    moment.tz.setDefault(s.TZ || 'Africa/Nairobi');
    const time = moment().format('HH:mm:ss');
    const date = moment().format('dddd, MMMM Do YYYY');

    const header = `
╭═════〘 DARK-MD 𝐕② 𝐁𝐎𝐓 〙═════╮
┃✫╭═─────────────────═╮
┃✬│ 𝗨𝘀𝗲𝗿 : ${nomAuteurMessage}
┃✫│ 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefixe}
┃✫│ 𝗠𝗼𝗱𝗲 : ${mode}
┃✯│ 𝗦𝗽𝗲𝗲𝗱 : ${(os.loadavg()[0]).toFixed(2)} 𝗠𝘀
┃✬│ 𝗧𝗶𝗺𝗲 : ${time} on ${date}
┃✫│ 𝗥𝗔𝗠 : ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)}GB
┃✬│ 𝐂𝐑𝐄𝐀𝐓𝐄𝐃 𝐁𝐘 : DARK TECH
┃✫│═════════════════════
╰══⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊══╯

${readmore}╔═════『 𝐃𝐀𝐑𝐊 𝐌𝐃 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 』═════╗`;

    let body = "";

    for (const cat in coms) {
        body += `\n\n╭─⌬ *${cat.toUpperCase()}* ⌬─╮\n`;
        coms[cat].forEach(cmd => {
            body += `┃ ✦ ${prefixe}${cmd}\n`;
        });
        body += `╰────────────────────╯`;
    }

    const footer = `
╔═════『 © 2025 DARK TECH 』═════╗
┃  Built with love by DARK TECH TEAM
╚══════════════════════════════╝`;

    const caption = header + body + footer;
    const media = mybotpic();

    try {
        if (media.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(dest, {
                video: { url: media },
                caption: caption,
                gifPlayback: true
            }, { quoted: ms });
        } else if (media.match(/\.(jpg|jpeg|png)$/i)) {
            await zk.sendMessage(dest, {
                image: { url: media },
                caption: caption
            }, { quoted: ms });
        } else {
            await repondre(caption);
        }
    } catch (e) {
        console.error("❌ MENU ERROR:", e);
        await repondre("❌ Failed to display the menu.");
    }
});
