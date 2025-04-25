let header = `
┌───『 𝗗𝗔𝗥𝗞 𝗠𝗗 𝗩𝟮 』───┐
│ ⚙️ *Owner:* ${s.OWNER_NAME}
│ 🌐 *Mode:* ${mode}
│ 🧩 *Prefix:* ${s.PREFIXE}
│ 📦 *Commands:* ${cm.length}
│ 💻 *Platform:* ${os.platform().toUpperCase()}
│ 🧠 *RAM:* ${Math.round(os.totalmem() / 1024 / 1024)}MB
│ ⏱ *Uptime:* ${format(os.uptime())}
│ 🕒 *Time:* ${time}
│ 📅 *Date:* ${date}
│ 📞 *Support:* wa.me/254107065646
└────────────────────┘

${readmore}╭────『 𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨 』────╮`;

let body = "";

for (const cat in coms) {
    body += `\n\n┌─⟪ ${cat.toUpperCase()} ⟫─┐`;
    for (const cmd of coms[cat]) {
        body += `\n│ ✧ ${prefixe}${cmd}`;
    }
    body += `\n└───────────────┘`;
}

let footer = `

┌─「 © 2025 ᴅᴀʀᴋ ᴛᴇᴄʜ 」─┐
│ Built for power and control
└──────────────────────┘`;
