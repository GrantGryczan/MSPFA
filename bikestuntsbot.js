"use strict";
console.log("< BikeStuntsBot >");
const fs = require("fs");
const Discord = require("discord.js");
const evalTest = /```js\n((?:.|\n)*?)\n```/;
const doNothing = () => { };
let data;
const load = () => {
	data = JSON.parse(fs.readFileSync("secret/bikestunts.json"));
};
load();
const save = () => {
	fs.writeFileSync("secret/bikestunts.json", JSON.stringify(data));
};
const client = new Discord.Client();
const exitOnError = err => {
	console.error(err);
	process.exit(1);
};
process.once("unhandledRejection", exitOnError);
client.once("error", exitOnError);
client.once("disconnect", exitOnError);
const respond = channel => {
	channel.send("Have you tried `ctrl`+`F5`?").catch(doNothing);
};
let guild;
let general;
let miro;
client.once("ready", () => {
	guild = client.guilds.cache.get("294616636726444033");
	general = guild.channels.cache.get("394160269980467200");
	miro = guild.members.cache.get("152282430915608578");
	client.user.setPresence({
		status: "online"
	});
	client.user.setActivity(" ");
});
client.on("guildMemberAdd", member => {
	general.send(`Welcome ${member} to ${guild.name}! There's punch and cookies by the door!`);
});
client.on("typingStart", channel => {
	if (channel.type === "dm") {
		respond(channel);
	}
});
const prefix = /^> ?/;
client.on("message", async msg => {
	if (msg.author.bot) {
		return;
	}
	const isPublic = msg.channel.type === "text";
	if (isPublic) {
		const member = msg.guild.member(msg.author) || await msg.guild.members.fetch(msg.author);
		const perm = member.hasPermission(8);
		if (msg.content.includes("<@294635195439513601>") || msg.content.includes("<@!294635195439513601>")) {
			respond(msg.channel);
		}
		if (msg.channel.id === "394162947867410434") {
			const now = Date.now();
			if (msg.author.id !== data.lastShillAuthor && now - data.lastShillDate < 300000 && !perm) {
				msg.delete();
				msg.author.send("You must wait at least five minutes after someone posts in <#394162947867410434> before posting there too.", {
					embed: {
						title: "Your archived message",
						description: msg.content
					}
				});
			} else {
				data.lastShillDate = now;
				data.lastShillAuthor = msg.author.id;
				save();
			}
		} else if (msg.channel.id === "394162913155219456" && (msg.attachments.size || msg.embeds.length || msg.content.includes("://"))) {
			const now = Date.now();
			if (msg.author.id !== data.lastCreativeAuthor && now - data.lastCreativeDate < 300000 && !perm) {
				msg.delete();
				msg.author.send("You must wait at least five minutes after someone posts a creative work in <#394162913155219456> before posting yours too.", {
					embed: {
						title: "Your archived message",
						description: msg.content
					}
				});
			} else {
				data.lastCreativeDate = now;
				data.lastCreativeAuthor = msg.author.id;
				save();
			}
		}
		if (prefix.test(msg.content)) {
			let content = msg.content.replace(prefix, "");
			const contentSpaceIndex = content.indexOf(" ");
			const contentLineIndex = content.indexOf("\n");
			const contentIndex = Math.min((contentSpaceIndex !== -1) ? contentSpaceIndex : Infinity, (contentLineIndex !== -1) ? contentLineIndex : Infinity);
			if (contentIndex !== Infinity) {
				content = [content.slice(0, contentIndex), content.slice(contentIndex + 1)];
			} else {
				content = [content];
			}
			content[0] = content[0].toLowerCase();
			if (content[0] === "help") {
				msg.author.send("**There is no help for you now.**");
			} else if (perm) {
				if (content[0] === "say") {
					msg.delete().then(() => {
						msg.channel.send(content[1]).catch(doNothing);
					});
				} else if (content[0] === "delete") {
					msg.delete().then(() => {
						const messages = parseInt(content[1]);
						if (!isNaN(content[1])) {
							msg.channel.bulkDelete(parseInt(content[1])).catch(doNothing);
						}
					});
				} else if (content[0] === "react") {
					const emojis = content[1].split(" ");
					msg.channel.messages.fetch({
						limit: 1,
						before: msg.id
					}).then(msgs => {
						const msg2 = msgs.first();
						for (const emoji of emojis) {
							if (emoji) {
								msg2.react(emoji).catch(doNothing);
							}
						}
						msg.delete();
					});
				} else if (content[0] === "eval") {
					try {
						eval(content[1].replace(evalTest, "$1"));
					} catch (err) {
						console.error(err);
					}
				}
			}
		}
	} else {
		respond(msg.channel);
	}
});
client.login(data.token);
fs.watch(__filename, () => {
	process.exit();
});
require("replthis")(v => eval(v));
