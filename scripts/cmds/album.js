const axios = require("axios");
const tinyurl = require("tinyurl");

const categories = [
  "funny", "romantic", "lofi", "sad", "horny", "football", "anime", "cricket",
  "flowers", "islamic", "cartoon", "couple", "random", "sigma", "asthetic",
  "girls", "friends", "free fire", "18+", "lyrics", "photos", "cat", "meme"
];

module.exports = {
  config: {
    name: "album",
    aliases: [],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 2,
    role: 0,
    description: {
      en: "Upload video to category or get video by category",
    },
    category: "media",
    guide: {
      en: "{pn} → category list\n{pn} add [category] → upload\nReply to list with number → get video",
    },
  },

  onStart: async function ({ api, args, event, commandName }) {
    const hasan = "https://hasan-all-apis.onrender.com";

    if (args[0] === "list") {
      let msg = "Available categories to add videos:\n\n";
      categories.forEach((cat, index) => {
        msg += `${index + 1}. ${cat}\n`;
      });
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (args[0] === "add") {
      const category = args.slice(1).join(" ").trim().toLowerCase();

      if (!categories.includes(category)) {
        return api.sendMessage(
          "❌ Invalid category!\n\nAvailable:\n" + categories.map((c, i) => `${i + 1}. ${c}`).join("\n"),
          event.threadID,
          event.messageID
        );
      }

      const originalUrl = event.messageReply?.attachments[0]?.url;
      if (!originalUrl) {
        return api.sendMessage("❌ | Please reply to a video to upload.", event.threadID, event.messageID);
      }

      try {
        const videoUrl = await tinyurl.shorten(originalUrl);
        const upload = await axios.get(`${hasan}/save-album?category=${encodeURIComponent(category)}&link=${encodeURIComponent(videoUrl)}`);
        return api.sendMessage(upload.data.message || "✅ Uploaded successfully.", event.threadID, event.messageID);
      } catch (err) {
        console.error(err);
        return api.sendMessage("❌ | Failed to upload.", event.threadID, event.messageID);
      }
    }

    try {
      const all = await axios.get(`${hasan}/album`);
      const toxic = all.data.category;
      let msg = `🔖 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 ✨\n\n`;
      toxic.forEach((cat, index) => {
        msg += `${index + 1}. ${cat}\n`;
      });
      msg += `\n➡️ Reply this message with a number of the list to get that categories video`;

      api.sendMessage(msg, event.threadID, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
          categories: toxic
        });
      }, event.messageID);
    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ | Failed to fetch categories.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ event, api, Reply }) {
    const { categories } = Reply;
    const choice = parseInt(event.body);

    if (isNaN(choice) || choice < 1 || choice > categories.length) {
      return api.sendMessage("❌ | Invalid number. Please reply with a valid number from the list.", event.threadID, event.messageID);
    }

    const selectedCategory = categories[choice - 1];
    const apiURL = "https://hasan-all-apis.onrender.com";

    try {
      const get = await axios.get(`${apiURL}/album?category=${encodeURIComponent(selectedCategory)}`);
      const link = get.data.link;

      if (!link) {
        return api.sendMessage("can't find any video in this category...! please add video to this category", event.threadID, event.messageID);
      }

      await api.unsendMessage(Reply.messageID);

      return api.sendMessage({
        body: `🎬 | Here is your video from the category "${selectedCategory}"`,
        attachment: await global.utils.getStreamFromURL(link)
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage(`❌ | Error fetching video.\n${err.message}`, event.threadID, event.messageID);
    }
  }
};
