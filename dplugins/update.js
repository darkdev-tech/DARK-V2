const { zokou } = require('../framework/zokou');
const { exec } = require('child_process');

zokou(
  {
    nomCom: 'update',
    categorie: 'Owner',
    reaction: '♻️'
  },
  async (m, zk, { repondre, auteurMessage }) => {

    const OWNER_ID = '2547107065646'; // change to your WhatsApp number

    if (!auteurMessage.includes(OWNER_ID)) {
      return repondre("You're not authorized to perform updates.");
    }

    repondre("Fetching updates from GitHub...");

    exec('git pull https://github.com/darkdev-tech/DARK-V2.git', (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return repondre("Update failed:\n```" + stderr + "```");
      }

      repondre("Update successful:\n```" + stdout + "```");

      repondre("Installing dependencies...");
      exec('npm install', (errInstall, stdoutInstall, stderrInstall) => {
        if (errInstall) {
          return repondre("Dependencies installation failed:\n```" + stderrInstall + "```");
        }

        repondre("Dependencies installed. Restarting bot...");

        // Restart the bot using PM2 or exit if you're using auto-restart on Render/Heroku
        exec('pm2 restart all', (errRestart, stdoutRestart, stderrRestart) => {
          if (errRestart) {
            console.error(stderrRestart);
            return repondre("Restart failed. Please restart manually.");
          }

          repondre("Update complete and bot restarted successfully!");
        });
      });
    });
  }
);
