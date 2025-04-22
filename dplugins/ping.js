const os = require("os");
const { performance } = require("perf_hooks");
const moment = require("moment-timezone");
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const s = require(__dirname + "/../set");

zokou({ nomCom: "ping", categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  const start = performance.now();
  const uptime = format(os.uptime());
  const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
  const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
  const usedMem = (totalMem - freeMem).toFixed(2);
  const currentTime = moment().tz(s.TZ || 'Africa/Nairobi').format('HH:mm:ss');

  const responseTime = (performance.now() - start).toFixed(2);

  const text = `
╔═══『 *PONG!* 』═══╗

⏱️ *Response:* ${responseTime} ms
⏳ *Uptime:* ${uptime}
⚙️ *Platform:* ${os.platform().toUpperCase()}
💾 *RAM:* ${usedMem}MB / ${totalMem}MB
⏰ *Time:* ${currentTime}
🔧 *Mode:* ${s.MODE.toLowerCase() === "yes" ? "🟢 Public" : "🔒 Private"}

📍 *Bot:* DARK MD V2
👑 *Owner:* ${s.OWNER_NAME}

╚════════════════════╝`;

  repondre(text);
});
