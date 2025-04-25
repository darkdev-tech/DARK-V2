const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');

// ================= TAGALL ================= //
zokou({ nomCom: "tagall", categorie: 'Group', reaction: "📣" }, async (dest, zk, options) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = options;

  if (!verifGroupe) return repondre("❌ This command is for groups only.");

  const mess = arg?.join(" ") || '📌 *No message provided.*';
  const membresGroupe = await infosGroupe.participants;
  const emojis = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$','😟','🥵','🐅'];
  const rand = () => emojis[Math.floor(Math.random() * emojis.length)];

  let tagMessage = `╭───〘 ⚠️ *TAG ALL* ⚠️ 〙───
│📛 *Group:* ${nomGroupe}
│🙋 *Sender:* ${nomAuteurMessage}
│💬 *Message:* ${mess}
╰───────────────────────\n\n`;

  for (const membre of membresGroupe) {
    tagMessage += `${rand()} @${membre.id.split("@")[0]}\n`;
  }

  if (verifAdmin || superUser) {
    zk.sendMessage(dest, { text: tagMessage, mentions: membresGroupe.map(m => m.id) }, { quoted: ms });
  } else {
    repondre("❗ This command is for admins only.");
  }
});

// ================= GROUP LINK ================= //
zokou({ nomCom: "link", categorie: 'Group', reaction: "🙋" }, async (dest, zk, { repondre, nomGroupe, nomAuteurMessage, verifGroupe }) => {
  if (!verifGroupe) return repondre("⚠️ This is a group-only command.");

  const inviteCode = await zk.groupInviteCode(dest);
  const link = `https://chat.whatsapp.com/${inviteCode}`;
  repondre(`🔗 *Group Link:*\nHello ${nomAuteurMessage}, here's the invite for *${nomGroupe}*\n\n${link}\n\n© 𝐃𝐀𝐑𝐊 𝐌𝐃`);
});

// ================= PROMOTE ================= //
zokou({ nomCom: "promote", categorie: 'Group', reaction: "🧑🏾‍💼" }, async (dest, zk, opt) => {
  const { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = opt;
  if (!verifGroupe) return repondre("🔒 Group only.");

  const membres = await infosGroupe.participants;
  const admins = membres.filter(m => m.admin).map(m => m.id);

  if (!(admins.includes(auteurMessage) || superUser)) return repondre("❌ You're not admin.");
  if (!admins.includes(idBot)) return repondre("⚠️ I need admin rights.");
  if (!msgRepondu) return repondre("🗣️ Tag the member to promote.");
  if (!membres.find(m => m.id === auteurMsgRepondu)) return repondre("❌ User not in group.");
  if (admins.includes(auteurMsgRepondu)) return repondre("✅ Already an admin.");

  await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
  zk.sendMessage(dest, { text: `🎉 @${auteurMsgRepondu.split("@")[0]} is now an admin!`, mentions: [auteurMsgRepondu] });
});

// ================= DEMOTE ================= //
zokou({ nomCom: "demote", categorie: 'Group', reaction: "⚒️" }, async (dest, zk, opt) => {
  const { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = opt;
  if (!verifGroupe) return repondre("🔒 Group only.");

  const membres = await infosGroupe.participants;
  const admins = membres.filter(m => m.admin).map(m => m.id);

  if (!(admins.includes(auteurMessage) || superUser)) return repondre("❌ You're not admin.");
  if (!admins.includes(idBot)) return repondre("⚠️ I need admin rights.");
  if (!msgRepondu) return repondre("🗣️ Tag the member to demote.");
  if (!membres.find(m => m.id === auteurMsgRepondu)) return repondre("❌ User not in group.");
  if (!admins.includes(auteurMsgRepondu)) return repondre("🔹 Not an admin.");

  await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
  zk.sendMessage(dest, { text: `🔻 @${auteurMsgRepondu.split("@")[0]} has been demoted.`, mentions: [auteurMsgRepondu] });
});

// ================= REMOVE ================= //
zokou({ nomCom: "remove", categorie: 'Group', reaction: "🚫" }, async (dest, zk, opt) => {
  const { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, nomAuteurMessage, superUser, idBot } = opt;
  if (!verifGroupe) return repondre("🔒 Group only.");

  const membres = await infosGroupe.participants;
  const admins = membres.filter(m => m.admin).map(m => m.id);

  if (!(admins.includes(auteurMessage) || superUser)) return repondre("❌ You are not admin.");
  if (!admins.includes(idBot)) return repondre("⚠️ I need admin rights.");
  if (!msgRepondu) return repondre("🗣️ Tag the member to remove.");
  if (!membres.find(m => m.id === auteurMsgRepondu)) return repondre("❌ User not in group.");
  if (admins.includes(auteurMsgRepondu)) return repondre("❗ Cannot remove an admin.");

  const gif = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
  const sticker = new Sticker(gif, {
    pack: 'Zokou-Md',
    author: nomAuteurMessage,
    type: StickerTypes.FULL,
    categories: ['😈'],
    quality: 50,
    background: '#000000'
  });

  await sticker.toFile("kick.webp");
  await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
  zk.sendMessage(dest, { text: `🚷 @${auteurMsgRepondu.split("@")[0]} was removed from the group.`, mentions: [auteurMsgRepondu] });
});

// ================= DELETE MESSAGE ================= //
zokou({ nomCom: "del", categorie: 'Group', reaction: "🧹" }, async (dest, zk, opt) => {
  const { ms, repondre, verifGroupe, auteurMsgRepondu, idBot, msgRepondu, verifAdmin, superUser } = opt;
  if (!msgRepondu) return repondre("❌ Tag the message to delete.");

  if (superUser && auteurMsgRepondu === idBot) {
    const key = { remoteJid: dest, fromMe: true, id: ms.message.extendedTextMessage.contextInfo.stanzaId };
    await zk.sendMessage(dest, { delete: key });
    return;
  }

  if (verifGroupe && (verifAdmin || superUser)) {
    const key = {
      remoteJid: dest,
      id: ms.message.extendedTextMessage.contextInfo.stanzaId,
      fromMe: false,
      participant: ms.message.extendedTextMessage.contextInfo.participant
    };
    await zk.sendMessage(dest, { delete: key });
  } else {
    repondre("❗ You must be an admin.");
  }
});

// ================= GROUP INFO ================= //
zokou({ nomCom: "info", categorie: 'Group', reaction: "ℹ️" }, async (dest, zk, { ms, repondre, verifGroupe }) => {
  if (!verifGroupe) return repondre("📌 Group only.");

  let ppgroup;
  try {
    ppgroup = await zk.profilePictureUrl(dest, 'image');
  } catch {
    ppgroup = conf.IMAGE_MENU;
  }

  const info = await zk.groupMetadata(dest);
  const mess = {
    image: { url: ppgroup },
    caption: `*━━━━『 Group Info 』━━━━*\n\n*📛 Name:* ${info.subject}\n*🆔 ID:* ${dest}\n\n*📝 Description:*\n${info.desc || 'No description'}`
  };

  zk.sendMessage(dest, mess, { quoted: ms });
});

const { zokou } = require("../framework/zokou");

// ================= ANTI LINK ================= //
zokou({ nomCom: "antilink", categorie: 'Group', reaction: "🔗" }, async (dest, zk, { ms, repondre, verifGroupe, superUser }) => {
  if (!verifGroupe) return repondre("⚠️ This command is for groups only.");

  const { message } = ms;

  // Define the list of allowed links (optional)
  const allowedLinks = [
    "https://chat.whatsapp.com/",
    // Add other allowed links here
  ];

  // Regex pattern to detect any kind of URL
  const urlPattern = /https?:\/\/[^\s]+/g;
  const links = message.text?.match(urlPattern);

  if (links && links.length > 0) {
    for (let link of links) {
      // Check if the link is not in the allowed list
      if (!allowedLinks.some(allowedLink => link.startsWith(allowedLink))) {
        // Remove the message with the link
        await zk.sendMessage(dest, {
          delete: { remoteJid: dest, id: message.id }
        });

        return repondre("❌ Link sharing is not allowed in this group.");
      }
    }
  }
});

const { zokou } = require("../framework/zokou");

// ================= ANTI BOT ================= //
zokou({ nomCom: "antibot", categorie: 'Group', reaction: "🚫" }, async (dest, zk, { infosGroupe, repondre, verifGroupe }) => {
  if (!verifGroupe) return repondre("⚠️ This command is for groups only.");

  const membres = await infosGroupe.participants;
  
  for (const membre of membres) {
    // Check if the member is a bot
    if (membre.isBot) {
      // Remove the bot from the group
      await zk.groupParticipantsUpdate(dest, [membre.id], "remove");

      // Stylish message
      const botRemovedMessage = `╭─────⚠️ *ANTI-BOT* ⚠️─────\n` +
                               `│\n` +
                               `│🚫 *Bot Alert!* 🚫\n` +
                               `│👤 *Removed User:* @${membre.id.split("@")[0]}\n` +
                               `│🔒 *Reason:* Bots are not allowed in this group.\n` +
                               `╰─────────────────────────`;

      zk.sendMessage(dest, { text: botRemovedMessage, mentions: [membre.id] });
    }
  }
});
