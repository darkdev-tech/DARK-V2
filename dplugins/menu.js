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
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");

    let coms = {};
    let mode = s.MODE.toLowerCase() === "yes" ? "🟢 Public" : "🔒 Private";

    cm.map((com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault(s.TZ || 'Africa/Nairobi');
    const time = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let header = `
╔═══════════════『 *DARK MD V2* 』═══════════════╗
┃
┃ ⌬ *Owner:* ${s.OWNER_NAME}
┃ ⌬ *Mode:* ${mode}
┃ ⌬ *Prefix:* ${s.PREFIXE}
┃ ⌬ *Commands:* ${cm.length}
┃ ⌬ *Platform:* ${os.platform().toUpperCase()}
┃ ⌬ *RAM:* ${Math.round(os.totalmem() / 1024 / 1024)}MB
┃ ⌬ *Uptime:* ${format(os.uptime())}
┃ ⌬ *Time:* ${time}
┃ ⌬ *Date:* ${date}
┃ ⌬ *Support:* wa.me/254107065646
┃
╚════════════════════════════════════════╝

${readmore}╔═════『 *𝐃𝐀𝐑𝐊 𝐌𝐃 𝐕2 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒* 』═════╗`;

    let body = "";

    for (const cat in coms) {
        body += `\n\n╭─⌬ *${cat.toUpperCase()}* ⌬─╮`;
        for (const cmd of coms[cat]) {
            body += `\n│ ✦ ${prefixe}${cmd}`;
        }
        body += `\n╰────────────────────────────╯`;
    }

    let footer = `

╔═════『 © 2025 DARK TECH 』═════╗
┃  Built with love by DARK_TECH
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
            repondre(caption);
        }
    } catch (e) {
        console.error("[MENU ERROR]", e);
        repondre("⚠️ Error displaying menu.");
    }
});
