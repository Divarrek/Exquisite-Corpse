const token = process.argv[2];
const Discord = require('discord.js');
const i18n = require('./app/lang/lang.js');
const client = new Discord.Client({autoReconnect : true});

i18n.setSourcePath("./app/data/messages.json");

// commands
var setPlayingOrder = function(channel) {
	if (1 == 1) {

	}

	return;
}

var getPhrase = function(channel) {
	return client.playingChannels[channel].phrase.noun1+" "+client.playingChannels[channel].phrase.adj1+" "+client.playingChannels[channel].phrase.verb+" "+client.playingChannels[channel].phrase.noun2+" "+client.playingChannels[channel].phrase.adj2;
}

var getPlayerChannel = function(userId) {
	for (var i = 0; i < Object.keys(client.playingChannels).length; i++) {
		if (client.playingChannels[Object.keys(client.playingChannels)[i]].players.indexOf(userId) != -1) {
			return Object.keys(client.playingChannels)[i];
		}
	}

	return false;
}

var removePlayerFromChannel = function(channel, userId) {
	if (client.playingChannels[channel].players.indexOf(userId) != -1) {
		client.playingChannels[channel].players.splice(client.playingChannels[channel].players.indexOf(userId), 1);

		return true;
	}

	return false;
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.playingChannels = {};
});

client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content === "!exq help") {
		msg.channel.send("**Commands** \n" +
					"Type `!exq help` to display help \n" +
					"Type `!exq rules` to get the rules of the game \n" +
					"Type `!exq start` in a channel to start a game (Makes you quit any game you previously joined)\n" +
					"Type `!exq join` in a channel to join the game (Makes you quit any game you previously joined)\n" +
					"Type `!exq quit` in a channel to quit the game \n" +
					"Type `!exq status` in a channel to get the current state of the game \n" +
					"After joining the game, send `noun1:`, `adj1:`, `verb:`, `noun2:` or `adj2:` followed by a word of your choice in a DM to me to fill out a blank in the sentence"
			);

		return;
	} else if (msg.content === "!exq status") {
		if (Object.keys(client.playingChannels).indexOf(msg.channel.id) != -1) {
			message = "** Status ** \n";

			for (var i = 0; i < Object.keys(client.playingChannels[msg.channel.id].phrase).length; i++) {
				if (client.playingChannels[msg.channel.id].phrase[Object.keys(client.playingChannels[msg.channel.id].phrase)[i]] == "") {
					message += Object.keys(client.playingChannels[msg.channel.id].phrase)[i] + " " + i18n.getString("IS_BLANK") + " \n";
				}
			}

			for (var i = 0; i < client.playingChannels[msg.channel.id].players.length; i++) {
				message += "<@" + client.playingChannels[msg.channel.id].players[i] + "> " + i18n.getString("IS_PLAYING") + " \n";
			}

			if (message != "") msg.channel.send(message);

			return;
		} else {
			msg.channel.send(i18n.getString("NO_GAME_RUNNING"));
		}
	} else if (msg.content === "!exq rules") {
		msg.channel.send("** Rules ** \n" +
					""
			);

		return;
	} else if (msg.content === "!exq join") {
		if (msg.guild) {
			if (Object.keys(client.playingChannels).indexOf(msg.channel.id) != -1 && client.playingChannels[msg.channel.id].players.indexOf(msg.author.id) == -1) {
				let chan = getPlayerChannel(msg.author.id)

				if (chan !== false) {
					if (removePlayerFromChannel(chan, msg.author.id)) {
						client.channels.get(chan).send("<@" + msg.author.id + "> " + i18n.getString("LEFT_THE_GAME"));
					}
				}

				client.playingChannels[msg.channel.id].players.push(msg.author.id);

				msg.reply(i18n.getString("JOINED_THE_GAME"));
			} else if (Object.keys(client.playingChannels).indexOf(msg.channel.id) == -1) {
				let chan = getPlayerChannel(msg.author.id)

				if (chan !== false) {
					if (removePlayerFromChannel(chan, msg.author.id)) {
						client.channels.get(chan).send("<@" + msg.author.id + "> " + i18n.getString("LEFT_THE_GAME"));
					}
				}

				client.playingChannels[msg.channel.id] = { "players" : [msg.author.id]};
				client.playingChannels[msg.channel.id].phrase = {
					"noun1" : "",
					"adj1" : "",
					"verb" : "",
					"noun2" : "",
					"adj2" : ""
				};
				setPlayingOrder(msg.channel.id);

				msg.reply(i18n.getString("STARTED_A_GAME"));
			} else if (client.playingChannels[msg.channel.id].players.indexOf(msg.author.id) != -1) {
				msg.reply(i18n.getString("HEARD_YOU"));
			}
		} else {
			msg.reply(i18n.getString("NO_GAME_IN_DM"));
		}

		return;
	} else if (msg.content === "!exq quit") {
		let chan = getPlayerChannel(msg.author.id)

		if (chan === msg.channel.id) {
			if (removePlayerFromChannel(chan, msg.author.id)) {
				msg.reply(i18n.getString("LEFT_THE_GAME"));

				return;
			}
		}
		msg.reply(i18n.getString("DID_NOT_JOIN"));

		return;
	} else if (msg.content === "!exq start") {
		if (msg.guild) {
			let chan = getPlayerChannel(msg.author.id)

			if (chan !== false) {
				if (removePlayerFromChannel(chan, msg.author.id)) {
					client.channels.get(chan).send("<@" + msg.author.id + "> " + i18n.getString("LEFT_THE_GAME"));
				}
			}

			msg.reply(i18n.getString("STARTED_A_GAME"));
			client.playingChannels[msg.channel.id] = { "players" : [msg.author.id]};
			client.playingChannels[msg.channel.id].phrase = {
				"noun1" : "",
				"adj1" : "",
				"verb" : "",
				"noun2" : "",
				"adj2" : ""
			};

			setPlayingOrder(msg.channel.id);
		} else {
			msg.reply(i18n.getString("NO_GAME_IN_DM"));
		}

		return;
	}

	var curChannel = getPlayerChannel(msg.author.id);

	if (curChannel) {
		if (msg.content.startsWith("noun1:")) {
			client.playingChannels[curChannel].phrase.noun1 = msg.content.replace("noun1:", "");
		} else if (msg.content.startsWith("adj1:")) {
			client.playingChannels[curChannel].phrase.adj1 = msg.content.replace("adj1:", "");
		} else if (msg.content.startsWith("verb:")) {
			client.playingChannels[curChannel].phrase.verb = msg.content.replace("verb:", "");
		} else if (msg.content.startsWith("noun2:")) {
			client.playingChannels[curChannel].phrase.noun2 = msg.content.replace("noun2:", "");
		} else if (msg.content.startsWith("adj2:")) {
			client.playingChannels[curChannel].phrase.adj2 = msg.content.replace("adj2:", "");
		}

		if (client.playingChannels[curChannel].phrase.noun1 != "" && client.playingChannels[curChannel].phrase.adj1 != "" && client.playingChannels[curChannel].phrase.verb != "" && client.playingChannels[curChannel].phrase.noun2 != "" && client.playingChannels[curChannel].phrase.adj2 != "") {
			client.channels.get(curChannel).send(getPhrase(curChannel));
			client.playingChannels[curChannel].phrase = {
				"noun1" : "",
				"adj1" : "",
				"verb" : "",
				"noun2" : "",
				"adj2" : ""
			};

			setPlayingOrder(curChannel);
		}
	}
});

client.login(token);

let i = 0;
client.setInterval(function() {
	console.log(i);
	i++;
}, 120000);
