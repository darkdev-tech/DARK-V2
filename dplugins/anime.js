const axios = require("axios");
const { zokou } = require("../framework/zokou");
const traduire = require("../framework/traduction");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

// ╔═══════『 RANDOM ANIME 』═══════╗
zokou({
  nomCom: "anime",
  categorie: "Fun",
  reaction: "📺"
}, async (origineMessage, zk, { repondre, ms }) => {
  const jsonURL = "https://api.jikan.moe/v4/random/anime";
  try {
    const { data } = await axios.get(jsonURL);
    const anime = data.data;

    const caption = `╔═════『 *𝗔𝗡𝗜𝗠𝗘 𝗦𝗣𝗢𝗧* 』═════╗
📺 *Title:* ${anime.title}
🎬 *Episodes:* ${anime.episodes || "Unknown"}
📡 *Status:* ${anime.status}
📝 *Synopsis:* ${anime.synopsis || "No synopsis available."}
🔗 *More Info:* ${anime.url}
╚════════════════════╝`;

    zk.sendMessage(origineMessage, {
      image: { url: anime.images.jpg.image_url },
      caption,
    }, { quoted: ms });
  } catch (err) {
    console.error(err);
    repondre("⚠️ Oops! Failed to fetch anime info. Try again later.");
  }
});

// ╔═══════『 GOOGLE SEARCH 』═══════╗
zokou({
  nomCom: "google",
  categorie: "Search"
}, async (dest, zk, { arg, repondre }) => {
  if (!arg[0]) return repondre("🔍 Provide a search query like: .google What is AI?");

  const google = require('google-it');
  try {
    const results = await google({ query: arg.join(" ") });
    let msg = `🔍 *Google Results for:* _${arg.join(" ")}_\n\n`;

    results.slice(0, 5).forEach(result => {
      msg += `➤ *${result.title}*\n${result.snippet}\n🌐 ${result.link}\n\n`;
    });

    repondre(msg.trim());
  } catch (err) {
    repondre("⚠️ Something went wrong while searching Google.");
  }
});

// ╔═══════『 IMDB SEARCH 』═══════╗
zokou({
  nomCom: "imdb",
  categorie: "Search"
}, async (dest, zk, { arg, repondre, ms }) => {
  if (!arg[0]) return repondre("🎬 Please provide a movie name like: .imdb The Matrix");

  try {
    const { data } = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${arg.join(" ")}&plot=full`);
    if (!data || data.Response === "False") return repondre("❌ Movie not found!");

    const caption = `╔═════『 *IMDB DETAILS* 』═════╗
🎬 *Title:* ${data.Title}
📆 *Year:* ${data.Year}
⭐ *Rated:* ${data.Rated}
🕒 *Runtime:* ${data.Runtime}
🌐 *Language:* ${data.Language}
🌀 *Genre:* ${data.Genre}
🎥 *Director:* ${data.Director}
👥 *Actors:* ${data.Actors}
📝 *Plot:* ${data.Plot}
🏆 *Awards:* ${data.Awards}
📦 *Box Office:* ${data.BoxOffice}
🔗 *IMDB Rating:* ${data.imdbRating} (${data.imdbVotes} votes)
╚════════════════════╝`;

    zk.sendMessage(dest, { image: { url: data.Poster }, caption }, { quoted: ms });
  } catch (err) {
    repondre("⚠️ Error fetching IMDB data.");
  }
});

// ╔═══════『 MOVIE SEARCH 』═══════╗
zokou({
  nomCom: "movie",
  categorie: "Search"
}, async (dest, zk, { arg, repondre, ms }) => {
  if (!arg[0]) return repondre("🎥 Please provide a movie/series name like: .movie John Wick");

  try {
    const { data } = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${arg.join(" ")}&plot=full`);
    if (!data || data.Response === "False") return repondre("❌ Movie not found!");

    const caption = `🔗 *Download Movies From Telegram:* https://t.me/moviebox_free_movie_download

🎬 *Title:* ${data.Title}
📅 *Year:* ${data.Year}
⭐ *Rated:* ${data.Rated}
📆 *Released:* ${data.Released}
⏳ *Runtime:* ${data.Runtime}
🌀 *Genre:* ${data.Genre}
👨🏻‍💻 *Director:* ${data.Director}
✍ *Writers:* ${data.Writer}
👨 *Actors:* ${data.Actors}
📃 *Plot:* ${data.Plot}
🌐 *Language:* ${data.Language}
🌍 *Country:* ${data.Country}
🎖️ *Awards:* ${data.Awards}
📦 *Box Office:* ${data.BoxOffice}
🏙️ *Production:* ${data.Production}
🌟 *Rating:* ${data.imdbRating}
❎ *Votes:* ${data.imdbVotes}`;

    zk.sendMessage(dest, { image: { url: data.Poster }, caption }, { quoted: ms });
  } catch (err) {
    repondre("⚠️ Error fetching movie details.");
  }
});

// ╔═══════『 EMOJI MIX 』═══════╗
zokou({
  nomCom: "emojimix",
  categorie: "Conversion"
}, async (dest, zk, { arg, repondre, ms, nomAuteurMessage }) => {
  if (!arg[0] || !arg[0].includes(";")) return repondre("💡 Use it like: .emojimix 😀;🥰");

  const [emoji1, emoji2] = arg.join(" ").split(";").map(e => e.trim());

  try {
    const res = await axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);

    if (res.data.status) {
      const sticker = new Sticker(res.data.result, {
        pack: nomAuteurMessage,
        type: StickerTypes.CROPPED,
        quality: 70,
        background: "transparent",
      });

      const buffer = await sticker.toBuffer();
      zk.sendMessage(dest, { sticker: buffer }, { quoted: ms });
    } else {
      repondre("❌ Couldn’t mix those emojis. Try different ones!");
    }
  } catch (err) {
    repondre(`⚠️ Error mixing emojis: ${err.message}`);
  }
});
