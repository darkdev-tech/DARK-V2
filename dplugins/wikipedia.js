const { zokou } = require("../framework/zokou");
const axios = require('axios');
const traduire = require('../framework/traduction');

// Wikipedia Command
zokou({
  nomCom: "wikipedia",
  categorie: "AI",
  reaction: "🔎"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms, auteurMessage, arg } = commandeOptions;

  // Check if the user provided a search term
  if (arg.length === 0) {
    return repondre('Please provide a search term for Wikipedia.');
  }

  try {
    // Fetch the data from Wikipedia API
    const searchQuery = arg.join(' '); // Join arguments as a search query
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(searchQuery)}`;

    const response = await axios.get(wikiUrl);
    const pages = response.data.query.pages;
    
    // Find the first page in the response
    const page = Object.values(pages)[0];

    if (!page || page.missing) {
      return repondre(`No Wikipedia page found for "${searchQuery}"`);
    }

    const pageTitle = page.title;
    const pageExtract = page.extract;

    // Send a message with the result
    const message = `*Wikipedia - ${pageTitle}*\n\n${pageExtract}\n\n[Read more](https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)})`;
    repondre(message);

  } catch (error) {
    console.error(error);
    repondre('An error occurred while fetching data from Wikipedia.');
  }
});
