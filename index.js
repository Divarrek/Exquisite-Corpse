const token = process.argv[2];
const Discord = require('discord.js');

const client = new Discord.Client({autoReconnect : true});

const i18n = require('./app/lang/lang.js');
const commands = require('./app/commands/commands.js');

var main = {};
main.client = client;

i18n.setSourcePath("./app/data/messages.json");

// commands
main.setPlayingOrder = function(channel) {
	if (1 == 1) {

	}

	return;
}

main.getPhrase = function(channel) {
	return main.client.playingChannels[channel].phrase.noun1+" "+main.client.playingChannels[channel].phrase.adj1+" "+main.client.playingChannels[channel].phrase.verb+" "+main.client.playingChannels[channel].phrase.noun2+" "+main.client.playingChannels[channel].phrase.adj2;
}

main.getPlayerChannel = function(userId) {
	for (var i = 0; i < Object.keys(main.client.playingChannels).length; i++) {
		if (main.client.playingChannels[Object.keys(main.client.playingChannels)[i]].players.indexOf(userId) != -1) {
			return Object.keys(main.client.playingChannels)[i];
		}
	}

	return false;
}

main.removePlayerFromChannel = function(channel, userId) {
	if (main.client.playingChannels[channel].players.indexOf(userId) != -1) {
		main.client.playingChannels[channel].players.splice(main.client.playingChannels[channel].players.indexOf(userId), 1);

		return true;
	}

	return false;
}

main.client.on('ready', () => {
	console.log(`Logged in as ${main.client.user.tag}!`);

	main.client.playingChannels = {};
});

main.client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content.startsWith("!exq")) {
		var parsedCommand = msg.content.split(" ");
		var command;
		var args;

		if (typeof parsedCommand[1] !== "undefined") {
			command = parsedCommand[1];
			parsedCommand.splice(0, 2);
			args = parsedCommand;

			if (typeof commands[command] !== "undefined" && typeof commands[command].callback === "function") {
				commands[command].callback(main, i18n, msg, args[0]);
			}
		}
	}

	var curChannel = main.getPlayerChannel(msg.author.id);

	if (curChannel) {
		if (msg.content.startsWith("noun1:")) {
			main.client.playingChannels[curChannel].phrase.noun1 = msg.content.replace("noun1:", "");
		} else if (msg.content.startsWith("adj1:")) {
			main.client.playingChannels[curChannel].phrase.adj1 = msg.content.replace("adj1:", "");
		} else if (msg.content.startsWith("verb:")) {
			main.client.playingChannels[curChannel].phrase.verb = msg.content.replace("verb:", "");
		} else if (msg.content.startsWith("noun2:")) {
			main.client.playingChannels[curChannel].phrase.noun2 = msg.content.replace("noun2:", "");
		} else if (msg.content.startsWith("adj2:")) {
			main.client.playingChannels[curChannel].phrase.adj2 = msg.content.replace("adj2:", "");
		}

		if (main.client.playingChannels[curChannel].phrase.noun1 != "" && main.client.playingChannels[curChannel].phrase.adj1 != "" && main.client.playingChannels[curChannel].phrase.verb != "" && main.client.playingChannels[curChannel].phrase.noun2 != "" && main.client.playingChannels[curChannel].phrase.adj2 != "") {
			main.client.channels.get(curChannel).send(main.getPhrase(curChannel));
			main.client.playingChannels[curChannel].phrase = {
				"noun1" : "",
				"adj1" : "",
				"verb" : "",
				"noun2" : "",
				"adj2" : ""
			};

			main.setPlayingOrder(curChannel);
		}
	}
});

main.client.login(token);

let i = 0;
main.client.setInterval(function() {
	console.log(i);
	i++;
}, 120000);
