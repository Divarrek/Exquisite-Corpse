const token = process.argv[2];

const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect : true});

global.i18n = require('./app/lang/lang.js');
const commands = require('./app/commands/commands.js')(client);

global.main = {};

main.getGame = function(userId) {
	for (var i = 0; i < Object.keys(client.games).length; i++) {
		if (client.games[Object.keys(client.games)[i]].players.indexOf(userId) != -1) {
			return Object.keys(client.games)[i];
		}
	}

	return false;
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.games = [];
	i18n.setSourcePath("./app/data/messages.json");
});

client.on('error', (err) => {
  console.log(err);
});

client.on('message', msg => {
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
				commands[command].callback(msg, args[0]);
			}
		}
	}

	var curChannel = main.getGame(msg.author.id);

	if (curChannel) {
		if (msg.content.startsWith("noun1:")) {
			client.games[curChannel].phrase.noun1 = msg.content.replace("noun1:", "");
		} else if (msg.content.startsWith("adj1:")) {
			client.games[curChannel].phrase.adj1 = msg.content.replace("adj1:", "");
		} else if (msg.content.startsWith("verb:")) {
			client.games[curChannel].phrase.verb = msg.content.replace("verb:", "");
		} else if (msg.content.startsWith("noun2:")) {
			client.games[curChannel].phrase.noun2 = msg.content.replace("noun2:", "");
		} else if (msg.content.startsWith("adj2:")) {
			client.games[curChannel].phrase.adj2 = msg.content.replace("adj2:", "");
		}

		if (client.games[curChannel].phrase.noun1 != "" && client.games[curChannel].phrase.adj1 != "" && client.games[curChannel].phrase.verb != "" && client.games[curChannel].phrase.noun2 != "" && client.games[curChannel].phrase.adj2 != "") {
			client.channels.get(curChannel).send(client.games[curChannel].getPhrase());
			client.games[curChannel].phrase = {
				"noun1" : "",
				"adj1" : "",
				"verb" : "",
				"noun2" : "",
				"adj2" : ""
			};
		}
	}
});

client.login(token);

let i = 0;
client.setInterval(function() {
	console.log(i);
	i++;
}, 120000);
