const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const os = require("os");
const s = require(__dirname + "/../set");

// DARK MD Custom Banner Design
const BANNER_TOP = `
╔═══⋆⋅☆⋅⋆════════════════⋆⋅☆⋅⋆═══╗
┃                                 ┃
┃   █▀▄▀█ █▀█ █▀▄▀█ █ █▄░█ █▀▀   ┃
┃   █░▀░█ █▄█ █░▀░█ █ █░▀█ █▄█   ┃
┃                                 ┃
┃   █▀▀ ▄▀█ █▀▄▀█ █▀▀ █▄░█ █▀▄   ┃
┃   █▄█ █▀█ █░▀░█ ██▄ █░▀█ █▄▀   ┃
┃                                 ┃
╚═══⋆⋅☆⋅⋆════════════════⋆⋅☆⋅⋆═══╝`;

const BANNER_BOTTOM = `
╔═══⋆⋅☆⋅⋆════════════════⋆⋅☆⋅⋆═══╗
┃                                 ┃
┃       D A R K   M D   v2        ┃
┃                                 ┃
╚═══⋆⋅☆⋅⋆════════════════⋆⋅☆⋅⋆═══╝`;

const SECTION_START = "┣━⋆⋅☆⋅⋆━";
const SECTION_END = "┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛";
const CMD_PREFIX = " ┃ ⎋ ";

// Create stylish separators
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ 
    nomCom: "menu", 
    categorie: "General",
    reaction: "🌀",
    description: "Display all available commands"
}, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");

    // Get system information
    moment.tz.setDefault(s.TZ || 'Africa/Nairobi');
    const time = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');
    const uptime = formatUptime(process.uptime());
    const mode = s.MODE.toLowerCase() === "yes" ? "🟢 PUBLIC" : "🔒 PRIVATE";
    const memory = `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`;

    // Organize commands by category
    let coms = {};
    cm.forEach((com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    // Create stylish header
    let header = `${BANNER_TOP}
┃                                                    ┃
┃   ✨ *Version:* DARK MD 2.5.0                      ┃
┃   👑 *Owner:* ${s.OWNER_NAME}                      ┃
┃   🔮 *Mode:* ${mode}                               ┃
┃   💫 *Prefix:* [ ${prefixe} ]                      ┃
┃   📦 *Commands:* ${cm.length} loaded               ┃
┃   🖥️ *Platform:* ${os.platform()} ${os.arch()}     ┃
┃   🧠 *Memory:* ${memory}                           ┃
┃   ⏱️ *Uptime:* ${uptime}                          ┃
┃   🕒 *Time:* ${time} | ${date}                     ┃
┃                                                    ┃
${BANNER_BOTTOM}`;

    // Create command sections
    let body = `\n${readmore}\n╔══════『 COMMAND CATALOG 』══════╗`;

    for (const cat in coms) {
        body += `\n\n${SECTION_START} *${cat.toUpperCase()}* ⋆⋅☆⋅⋆━┫`;
        coms[cat].forEach((cmd) => {
            body += `\n${CMD_PREFIX} ${prefixe}${cmd}`;
        });
        body += `\n${SECTION_END}`;
    }

    // Footer with additional info
    let bottom = `\n\n╔══════『 IMPORTANT LINKS 』══════╗
┃
┃ 📢 *Channel:* wa.me/0029VarDt9t30LKL1SoYXy26
┃ 💻 *GitHub:* github.com/darktech/dark-md
┃ 👥 *Support:* ${s.SUPPORT_GROUP || "Not configured"}
┃
${BANNER_BOTTOM.replace('DARK MD v2', '© 2024 DARK TECH')}`;

    const fullMenu = header + body + bottom;
    const media = mybotpic();

    try {
        // Send with media if available
        if (media) {
            if (media.match(/\.(mp4|gif)$/i)) {
                await zk.sendMessage(dest, {
                    video: { url: media },
                    caption: fullMenu,
                    gifPlayback: true
                }, { quoted: ms });
            } else if (media.match(/\.(jpg|jpeg|png)$/i)) {
                await zk.sendMessage(dest, {
                    image: { url: media },
                    caption: fullMenu
                }, { quoted: ms });
            } else {
                await zk.sendMessage(dest, { text: fullMenu }, { quoted: ms });
            }
        } else {
            await zk.sendMessage(dest, { text: fullMenu }, { quoted: ms });
        }
    } catch (e) {
        console.error("Menu Error:", e);
        repondre("🚫 Failed to display menu. Please try again.");
    }
});

// Helper function to format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

module.exports = {
    menuConfig: {
        showDescription: true,
        showCategoryHeaders: true,
        maxCommandsPerPage: 10
    }
};
