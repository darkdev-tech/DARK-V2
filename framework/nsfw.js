const fs = require("fs");
const path = "./bdd/nsfw.json";

if (!fs.existsSync("./bdd")) fs.mkdirSync("./bdd");

let nsfw = {};
if (fs.existsSync(path)) {
  nsfw = JSON.parse(fs.readFileSync(path));
}

function save() {
  fs.writeFileSync(path, JSON.stringify(nsfw, null, 2));
}

module.exports = {
  isNSFWEnabled: (jid) => !!nsfw[jid],
  enableNSFW: (jid) => { nsfw[jid] = true; save(); },
  disableNSFW: (jid) => { nsfw[jid] = false; save(); },
};
