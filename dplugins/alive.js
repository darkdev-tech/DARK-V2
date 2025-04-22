const { zokou } = require("../framework/zokou");
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//
//                   𝐁𝐎𝐓 𝐒𝐓𝐀𝐓𝐔𝐒                    //
//               𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐑𝐊-𝐌𝐃               //
//             𝐎𝐰𝐧𝐞𝐫: 𝐃𝐀𝐑𝐊 𝐓𝐄𝐂𝐇                 //
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

module.exports = {
   name: "alive",
   description: "Check if bot is running",
   alias: ["ping", "status"],
   category: "General",
   utilisation: "{prefix}alive",

   async execute(client, message, args) {
      try {
         // Bot information
         const botName = "DARK MD V2";
         const owner = "DARK TECH";
         const version = "2.0.0";
         const uptime = process.uptime();
         const hours = Math.floor(uptime / 3600);
         const minutes = Math.floor((uptime % 3600) / 60);
         const seconds = Math.floor(uptime % 60);
         
         // Stylish alive message
         const aliveMessage = `
╔════════════════════╗
       *${botName}* 
╚════════════════════╝

⚡ *Status*: ONLINE
👑 *Owner*: ${owner}
🔢 *Version*: ${version}
⏳ *Uptime*: ${hours}h ${minutes}m ${seconds}s

💻 *Server*: Running smoothly
📊 *Performance*: Excellent

🔗 *Official Group*: [Coming Soon]
📌 *Github*: [Private Repository]

💬 *Type* ${client.config.prefix}help *for commands*`;

         // Create a sticker (optional)
         const sticker = new Sticker("https://example.com/bot-image.png", {
            pack: botName,
            author: owner,
            type: StickerTypes.FULL,
            categories: ["🤖", "💙"],
            quality: 100,
            background: "#000000"
         });

         // Send response
         await client.sendMessage(message.from, {
            text: aliveMessage,
            mentions: [message.sender]
         });

         // Send sticker (optional)
         const stickerBuffer = await sticker.toBuffer();
         await client.sendMessage(message.from, {
            sticker: stickerBuffer
         }, {
            quoted: message
         });

      } catch (error) {
         console.error("Alive command error:", error);
         await client.sendMessage(message.from, {
            text: "❌ An error occurred while processing the alive command."
         });
      }
   }
};
