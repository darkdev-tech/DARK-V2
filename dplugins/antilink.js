zokou({ nomCom: "antilink", categorie: 'Group', reaction: "🔗" }, async (dest, zk, opt) => {
  const {
    repondre,
    auteurMessage,
    superUser,
    idBot,
    verifGroupe,
    isBotAdmin,
    prefixe,
    arg,
    bdd,
    nomGroupe
  } = opt;

  if (!verifGroupe) return repondre("🔒 *Group only command.*");
  if (!isBotAdmin) return repondre("⚠️ *I need admin rights to delete links.*");

  const isAdmin = opt.infosGroupe.participants
    .filter(p => p.admin)
    .map(p => p.id)
    .includes(auteurMessage);

  if (!(isAdmin || superUser)) return repondre("❌ *Only admins can enable/disable anti-link.*");

  const groupeId = dest;
  const cmd = arg[0]?.toLowerCase();

  if (!["on", "off"].includes(cmd)) {
    return repondre(`🔗 *Anti-Link Status:* ${bdd.antilink?.[groupeId] ? "ON" : "OFF"}\n\n` +
                    `*Usage:* \`${prefixe}antilink on\` or \`${prefixe}antilink off\``);
  }

  if (!bdd.antilink) bdd.antilink = {};
  if (cmd === "on") {
    bdd.antilink[groupeId] = true;
    repondre(`✅ *Anti-Link enabled in ${nomGroupe}.*\nLinks will be auto-deleted.`);
  } else {
    delete bdd.antilink[groupeId];
    repondre(`❌ *Anti-Link disabled in ${nomGroupe}.*`);
  }
});
