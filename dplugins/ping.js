const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const speed = require("performance-now");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== 🕶️ Dark MD V2 Theme ====================
const THEME = {
  PRIMARY: '🕶️',
  SECONDARY: '⚡',
  ERROR: '❌',
  SUCCESS: '✅',
  WARNING: '⚠️',
  INFO: 'ℹ️'
};

const PING_THRESHOLDS = {
  EXCELLENT: 100,
  GOOD: 300,
  FAIR: 600
};

// ==================== ⚡ Ping Command ====================
zokou({
  nomCom: "ping",
  desc: "Check bot response speed",
  categorie: "General",
  reaction: "⚡",
  fromMe: true
}, async (dest, zk, { repondre, ms }) => {
    try {
        const loadingMsg = await zk.sendMessage(dest, { 
            text: `${THEME.PRIMARY} *Dark MD V2* is testing connection...`
        }, { quoted: ms });

        await sleep(500); // Simulate processing

        // Measure ping
        const timestamp = speed();
        await sleep(200);
        const pingResult = (speed() - timestamp).toFixed(2);

        // Determine connection quality
        let quality;
        if (pingResult < PING_THRESHOLDS.EXCELLENT) quality = "𝐄𝐱𝐜𝐞𝐥𝐥𝐞𝐧𝐭";
        else if (pingResult < PING_THRESHOLDS.GOOD) quality = "𝐆𝐨𝐨𝐝";
        else if (pingResult < PING_THRESHOLDS.FAIR) quality = "𝐅𝐚𝐢𝐫";
        else quality = "𝐒𝐥𝐨𝐰";

        const resultMessage = `
${THEME.PRIMARY} *Dark MD V2 Performance*

${THEME.SECONDARY} 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐓𝐢𝐦𝐞: ${pingResult} ms
${THEME.SUCCESS} 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 𝐐𝐮𝐚𝐥𝐢𝐭𝐲: ${quality}
${getPerformanceBar(pingResult)}
`;

        await zk.sendMessage(dest, {
            text: resultMessage,
            edit: loadingMsg.key
        });

    } catch (error) {
        console.error("Ping error:", error);
        await repondre(`${THEME.ERROR} Failed to test connection.`);
    }
});

function getPerformanceBar(ping) {
    const maxBars = 10;
    const filledBars = Math.min(maxBars, Math.floor(maxBars * (1 - ping/1000)));
    return `📊 ${'█'.repeat(filledBars)}${'░'.repeat(maxBars - filledBars)}`;
}

// ==================== ⏱️ Uptime Command ====================
zokou({
  nomCom: "uptime",
  desc: "Check bot runtime",
  categorie: "General",
  reaction: "⏱️",
  fromMe: true
}, async (dest, zk, { repondre }) => {
    try {
        await repondre(`${THEME.PRIMARY} *Dark MD V2 Uptime*\n\n${formatUptime(process.uptime())}`);
    } catch (error) {
        console.error("Uptime error:", error);
        await repondre(`${THEME.ERROR} Failed to retrieve uptime.`);
    }
});

function formatUptime(seconds) {
    seconds = Number(seconds);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);

    return `⏱️ ${parts.join(' : ')}`;
}

// ==================== 📸 Screenshot Command ====================
zokou({
  nomCom: "ss",
  desc: "Take website screenshot",
  categorie: "General",
  reaction: "📸",
  fromMe: true
}, async (dest, zk, { ms, arg, repondre }) => {
    if (!arg || arg.length === 0) {
        return repondre(`${THEME.ERROR} Please provide a website URL.\nExample: .ss https://example.com`);
    }

    try {
        const loadingMsg = await repondre(`${THEME.PRIMARY} *Dark MD V2* is capturing screenshot...`);

        const url = arg.join(" ").trim();
        if (!isValidUrl(url)) {
            return repondre(`${THEME.ERROR} Invalid URL format. Include http:// or https://`);
        }

        const apiUrl = `https://api.maher-zubair.tech/misc/sstab?url=${encodeURIComponent(url)}&dimension=720x720&darkMode=true`;
        const screenshot = await getBuffer(apiUrl);

        await zk.sendMessage(dest, {
            image: screenshot,
            caption: `${THEME.PRIMARY} *Dark MD V2 Screenshot*\n🌐 ${url}`
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            delete: loadingMsg.key
        });

    } catch (error) {
        console.error("Screenshot error:", error);
        repondre(`${THEME.ERROR} Failed to capture screenshot. Website might be blocking requests.`);
    }
});

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Note: Ensure getBuffer() is implemented in your code
