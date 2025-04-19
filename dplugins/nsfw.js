const { zokou } = require("../lib/zokou");
const { enableNSFW, disableNSFW, isNSFWEnabled } = require("../lib/nsfw-config");

zokou({
  nomCom: "nsfw",
  categorie: "settings",
  fromMe: true, // Only owner/bot admin can toggle
  reaction: "🔞"
}, async (dest, zk, { ms, arg, reply, isGroup }) => {

  if (!isGroup) return reply("❌ This command can only be used in groups.");

  const input = arg[0]?.toLowerCase();
  if (!["on", "off"].includes(input)) {
    const status = isNSFWEnabled(dest) ? "ENABLED ✅" : "DISABLED ❌";
    return reply(`🔞 NSFW status in this group: *${status}*\n\nUse:\n• nsfw on\n• nsfw off`);
  }

  if (input === "on") {
    enableNSFW(dest);
    reply("✅ NSFW mode has been *ENABLED* in this group.");
  } else {
    disableNSFW(dest);
    reply("🚫 NSFW mode has been *DISABLED* in this group.");
  }
});
