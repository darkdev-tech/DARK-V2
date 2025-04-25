const { zokou } = require("../framework/zokou");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../bdd/sudo");
const conf = require("../set");

zokou({ nomCom: "owner", categorie: "General", reaction: "❣️" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;
    const thsudo = await isSudoTableNotEmpty();

    if (thsudo) {
        let sudos = await getAllSudoNumbers();
        let msg = `┏━━━━━━━━━━━━━━━┓
┃  *👑 𝙊𝙒𝙉𝙀𝙍𝙎 𝙊𝙁 𝘿𝘼𝙍𝙆-𝙈𝘿*  
┗━━━━━━━━━━━━━━━┛

*🌟 Main Owner:*
• wa.me/254107065646 (@254107065646)

*💫 Secondary Owner:*
• wa.me/254799283147 (@254799283147)\n\n`;

        if (sudos.length > 0) {
            msg += `*🔐 Additional Sudo Users:*\n`;
            for (const sudo of sudos) {
                const num = sudo.replace(/[^0-9]/g, '');
                if (!['254107065646', '254799283147'].includes(num)) {
                    msg += `• wa.me/${num} (@${num})\n`;
                }
            }
        }

        msg += `\n┏━━━━━━━━━━━━━━━┓
┃  *⚙️ 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝘿𝘼𝙍𝙆-𝙈𝘿*  
┗━━━━━━━━━━━━━━━┛`;

        const mentionedJid = [
            '254107065646@s.whatsapp.net',
            '254799283147@s.whatsapp.net',
            ...sudos.map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        ].filter(num => !['254107065646', '254799283147'].includes(num.replace(/@s\.whatsapp\.net/, '')))

        zk.sendMessage(
            dest,
            {
                image: { url: mybotpic() },
                caption: msg,
                mentions: mentionedJid
            },
            { quoted: ms }
        );
    } else {
        // VCARD fallback
        const vcard = 
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN:' + conf.OWNER_NAME + '\n' +
            'ORG:DARK-MD Development;\n' +
            'TEL;type=CELL;type=VOICE;waid=254107065646:+254107065646\n' +
            'END:VCARD';

        zk.sendMessage(
            dest,
            {
                contacts: {
                    displayName: "DARK-MD Owner",
                    contacts: [{ vcard }],
                },
            },
            { quoted: ms }
        );
    }
});

zokou({ nomCom: "dev", categorie: "General", reaction: "💘" }, async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;

    let message = `┏━『 𝙃𝙀𝘼𝘿 𝘿𝙀𝙑𝙀𝙇𝙊𝙋𝙀𝙍𝙎 』━┓

*💻 DARK TECH*
• https://wa.me/254107065646

*🧠 DARK-MD Dev*
• https://wa.me/254107065646

┗━━━━━━━━━━━━━━━━━┛
⚡ *24/7 Bot Support Available*
🔗 Powered by DARK-MD`;

    try {
        const lien = mybotpic();
        if (lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(
                dest,
                { video: { url: lien }, caption: message },
                { quoted: ms }
            );
        } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
            await zk.sendMessage(
                dest,
                { image: { url: lien }, caption: message },
                { quoted: ms }
            );
        } else {
            await repondre(message);
        }
    } catch (e) {
        console.error("❌ Error:", e);
        repondre("❌ Failed to send dev list.");
    }
});

zokou({ nomCom: "support", categorie: "General", reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, auteurMessage } = commandeOptions;

    const supportMessage = `
╭───────『 📩 𝙎𝙐𝙋𝙋𝙊𝙍𝙏 』───────╮

*🤖 Thank you for using DARK-MD!*

Join our updates channel:
🔗 https://whatsapp.com/channel/0029VarDt9t30LKL1SoYXy26

💬 Need help? Use *owner* or *dev*

╰────────────────────────╯
🔧 Powered by @dark_tech`;

    await repondre(supportMessage);
    await zk.sendMessage(
        auteurMessage,
        {
            text: `*📩 Support links sent to your DM!*\n\nJoin our community for updates and help.`
        },
        { quoted: ms }
    );
});
