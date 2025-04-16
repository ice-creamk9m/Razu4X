module.exports = {
	config: {
			name: "bot kar",
			version: "1.0",
			author: "Jaychris Garcia",
			countDown: 5,
			role: 0,
			shortDescription: "sarcasm",
			longDescription: "sarcasm",
			category: "reply",
	},
onStart: async function(){}, 
onChat: async function({
	event,
	message,
	getLang
}) {
	if (event.body && event.body.toLowerCase() == "bot kar") return message.reply("-আসসালামুআলাইকুম-আমি বট\nআমার বস এর নাম রাজু\n\n আমার বসের সম্পর্কে জানতে অথবা বসের ফেসবুক আইড়ি পেতে টাইপ করুন👇\n\n /info");
}
};
