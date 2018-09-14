let help = function(context, i18n, msg, lang=null) {
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
}

let status = function(context, i18n, msg, lang=null) {
  if (Object.keys(context.client.playingChannels).indexOf(msg.channel.id) != -1) {
    message = "** " + i18n.getString("STATUS", lang) + " ** \n";

    for (var i = 0; i < Object.keys(context.client.playingChannels[msg.channel.id].phrase).length; i++) {
      if (context.client.playingChannels[msg.channel.id].phrase[Object.keys(context.client.playingChannels[msg.channel.id].phrase)[i]] == "") {
        message += Object.keys(context.client.playingChannels[msg.channel.id].phrase)[i] + " " + i18n.getString("IS_BLANK", lang) + " \n";
      }
    }

    for (var i = 0; i < context.client.playingChannels[msg.channel.id].players.length; i++) {
      message += "<@" + context.client.playingChannels[msg.channel.id].players[i] + "> " + i18n.getString("IS_PLAYING", lang) + " \n";
    }

    if (message != "") msg.channel.send(message);

    return;
  } else {
    msg.channel.send(i18n.getString("NO_GAME_RUNNING", lang));
  }
}

let rules = function(context, i18n, msg, lang=null) {
  msg.channel.send("** Rules ** \n" +
      ""
  );

  return;
}

let join = function(context, i18n, msg, lang=null) {
  if (msg.guild) {
    if (Object.keys(context.client.playingChannels).indexOf(msg.channel.id) != -1 && context.client.playingChannels[msg.channel.id].players.indexOf(msg.author.id) == -1) {
      let chan = context.getPlayerChannel(msg.author.id)

      if (chan !== false) {
        if (context.removePlayerFromChannel(chan, msg.author.id)) {
          context.client.channels.get(chan).send("<@" + msg.author.id + "> " + i18n.getString("LEFT_THE_GAME", lang));
        }
      }

      context.client.playingChannels[msg.channel.id].players.push(msg.author.id);

      msg.reply(i18n.getString("JOINED_THE_GAME", lang));
    } else if (Object.keys(context.client.playingChannels).indexOf(msg.channel.id) == -1) {
      let chan = context.getPlayerChannel(msg.author.id)

      if (chan !== false) {
        if (context.removePlayerFromChannel(chan, msg.author.id)) {
          context.client.channels.get(chan).send("<@" + msg.author.id + "> " + i18n.getString("LEFT_THE_GAME", lang));
        }
      }

      context.client.playingChannels[msg.channel.id] = { "players" : [msg.author.id]};
      context.client.playingChannels[msg.channel.id].phrase = {
        "noun1" : "",
        "adj1" : "",
        "verb" : "",
        "noun2" : "",
        "adj2" : ""
      };
      context.setPlayingOrder(msg.channel.id);

      msg.reply(i18n.getString("STARTED_A_GAME", lang));
    } else if (context.client.playingChannels[msg.channel.id].players.indexOf(msg.author.id) != -1) {
      msg.reply(i18n.getString("HEARD_YOU", lang));
    }
  } else {
    msg.reply(i18n.getString("NO_GAME_IN_DM", lang));
  }

  return;
}

let quit = function(context, i18n, msg, lang=null) {
  let chan = context.getPlayerChannel(msg.author.id)

  if (chan === msg.channel.id) {
    if (context.removePlayerFromChannel(chan, msg.author.id)) {
      msg.reply(i18n.getString("LEFT_THE_GAME", lang));

      return;
    }
  }
  msg.reply(i18n.getString("DID_NOT_JOIN", lang));

  return;
}

let start = function(context, i18n, msg, lang=null) {
  if (msg.guild) {
    if (lang !== null) { i18n.defaultLang = lang; }

    let chan = context.getPlayerChannel(msg.author.id)

    if (chan !== false) {
      if (main.removePlayerFromChannel(chan, msg.author.id)) {
        main.client.channels.get(chan).send("<@" + msg.author.id + "> " + i18n.getString("LEFT_THE_GAME", lang));
      }
    }

    msg.reply(i18n.getString("STARTED_A_GAME", lang));
    context.client.playingChannels[msg.channel.id] = { "players" : [msg.author.id]};
    context.client.playingChannels[msg.channel.id].phrase = {
      "noun1" : "",
      "adj1" : "",
      "verb" : "",
      "noun2" : "",
      "adj2" : ""
    };

    context.setPlayingOrder(msg.channel.id);
  } else {
    msg.reply(i18n.getString("NO_GAME_IN_DM", lang));
  }

  return;
}

let commands = {
  help : {
    callback : help
  },
  status : {
    callback : status
  },
  rules : {
    callback : rules
  },
  join : {
    callback : join
  },
  quit : {
    callback : quit
  },
  start : {
    callback : start
  }
}

module.exports = commands;
