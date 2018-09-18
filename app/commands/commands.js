module.exports = function(ctx) {
  const Game = require('../game/Game.js')(ctx);

  let help = function(msg, lang=null) {
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

  let status = function(msg, lang=null) {
    if (Object.keys(ctx.games).indexOf(msg.channel.id) != -1) {
      let game = ctx.games[msg.channel.id];

      msg.channel.send(game.getStatus(lang));

      return;
    } else {
      msg.channel.send(i18n.getString("NO_GAME_RUNNING", lang));
    }
  }

  let rules = function(msg, lang=null) {
    msg.channel.send(i18n.getString("RULES", lang));

    return;
  }

  let join = function(msg) {
    if (msg.guild) {
      if (Object.keys(ctx.games).indexOf(msg.channel.id) != -1 && !ctx.games[msg.channel.id].isPlaying(msg.author.id)) {
        let chan = main.getGame(msg.author.id)

        if (chan !== false && chan != msg.channel.id) {
          ctx.games[chan].leave(msg.author.id);
        }

        ctx.games[msg.channel.id].join(msg.author.id);
      } else if (Object.keys(ctx.games).indexOf(msg.channel.id) == -1) {
        let chan = main.getGame(msg.author.id)

        if (chan !== false && chan != msg.channel.id) {
          ctx.games[chan].leave(msg.author.id);
        }

        ctx.games[msg.channel.id] = new Game(msg.channel.id, msg.author.id);
      } else if (ctx.games[msg.channel.id].isPlaying(msg.author.id)) {
        msg.reply(i18n.getString("HEARD_YOU"));
      }
    } else {
      msg.reply(i18n.getString("NO_GAME_IN_DM"));
    }

    return;
  }

  let quit = function(msg) {
    let chan = main.getGame(msg.author.id)

    if (chan === msg.channel.id) {
      ctx.games[chan].leave(msg.author.id);
    } else {
      msg.reply(i18n.getString("DID_NOT_JOIN"));
    }

    return;
  }

  let start = function(msg, lang=null) {
    if (msg.guild) {
      let chan = main.getGame(msg.author.id);

      if (chan !== false && chan != msg.channel.id) {
        ctx.games[chan].leave(msg.author.id);
      }

      ctx.games[msg.channel.id] = new Game(msg.channel.id, msg.author.id, lang);
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

  return commands;
};;
