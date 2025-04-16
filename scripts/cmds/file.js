const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files", "F"],
		version: "1.0",
		author: "404",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["100091756643026"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("Only Amar boss Razu use korte parbe তুই কে, যে আমি তোরে File দিব খানki 😎..", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("নাম ছাড়া খোজা কষ্ট, File এর নাম লেখো জান 😘.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`এই File নাই তোর Cos 2 sad সং 🥲: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
