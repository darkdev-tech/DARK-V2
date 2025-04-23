const { zokou } = require("../framework/zokou");
const fs = require('fs');

zokou(
  {
    nomCom: ["vv", "viewonce"],
    categorie: "General",  // Changed to General category
    reaction: "🔓",
    description: "Retrieve view-once media (images/videos/audio)"
  },
  async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre, arg, prefixe } = commandeOptions;

    // Help menu
    if (arg.includes('help')) {
      return repondre(`
🖤 *DARK MD V2 - VIEWONCE RETRIEVER* 🖤

🔹 *Usage:* 
   ${prefixe}vv (reply to view-once message)
   ${prefixe}viewonce (alternative command)

🔹 *Supported Media:*
   📷 Images  |  🎥 Videos
   🔉 Audio  |  📁 Documents

🔹 *Notes:*
   - Works on genuine view-once media
   - Media auto-deletes after sending
   - Includes original caption if available

Type ${prefixe}vv to get started!`);
    }

    if (!msgRepondu) {
      return repondre("❌ *Please reply to a view-once message!*\nExample: " + prefixe + "vv");
    }

    // Enhanced media detection
    const findMedia = (obj) => {
      if (!obj) return null;
      
      // Check for view-once flag in common locations
      const isViewOnce = 
        obj.viewOnce ||
        obj.message?.viewOnce ||
        obj.contextInfo?.viewOnce;

      if (isViewOnce) {
        const mediaTypes = [
          { type: 'image', keys: ['imageMessage', 'image'] },
          { type: 'video', keys: ['videoMessage', 'video'] },
          { type: 'audio', keys: ['audioMessage', 'audio', 'ptt'] },
          { type: 'document', keys: ['documentMessage', 'document'] }
        ];

        for (const {type, keys} of mediaTypes) {
          for (const key of keys) {
            if (obj[key]) return { type, media: obj[key] };
          }
        }
      }

      // Deep search
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          const result = findMedia(obj[key]);
          if (result) return result;
        }
      }
      return null;
    };

    const mediaData = findMedia(msgRepondu);

    if (!mediaData) {
      return repondre("🔎 *No view-once media found!*\nEnsure you're replying to:\n- A genuine view-once message\n- Unforwarded media\n- Non-expired content");
    }

    try {
      await repondre("⏳ *Processing media...*");
      
      const { type, media } = mediaData;
      const mediaPath = await zk.downloadAndSaveMediaMessage(media);
      const fileSize = (fs.statSync(mediaPath).size / 1024).toFixed(2) + ' KB';
      
      const caption = media.caption 
        ? `${media.caption}\n\n🔓 *Retrieved by DARK-MD*`
        : `🔓 *Media Retrieved*\n📦 Size: ${fileSize}\n🕒 ${new Date().toLocaleTimeString()}`;

      await zk.sendMessage(
        dest,
        {
          [type]: fs.readFileSync(mediaPath),
          caption: caption,
          mimetype: media.mimetype || 
                   type === 'image' ? 'image/jpeg' :
                   type === 'video' ? 'video/mp4' :
                   'audio/mpeg'
        },
        { quoted: ms }
      );

      fs.unlinkSync(mediaPath); // Cleanup

    } catch (error) {
      console.error("DARK-MD Error:", error);
      repondre(`❌ *Failed to retrieve!*\nError: ${error.message}\n\nTry again or contact support`);
    }
  }
);
