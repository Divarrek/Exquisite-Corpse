module.exports = function(ctx) {
  function Game(channel, playerId, lang=null) {
    this.channel = channel;
    this.players = [playerId];
    this.lang = lang;
    this.phrase = {
      "noun1" : "",
      "adj1" : "",
      "verb" : "",
      "noun2" : "",
      "adj2" : ""
    };

    ctx.channels.get(this.channel).send("<@" + playerId + "> " + i18n.getString("STARTED_A_GAME", this.lang));
  }

  Game.prototype.isPlaying = function (playerId) {
    return !(this.players.indexOf(playerId) == -1);
  }

  Game.prototype.join = function(playerId) {
      this.players.push(playerId);
      ctx.channels.get(this.channel).send("<@" + playerId + "> " + i18n.getString("JOINED_THE_GAME", this.lang));
  };

  Game.prototype.leave = function(playerId) {
    if (this.players.indexOf(playerId) != -1) {
  		this.players.splice(this.players.indexOf(playerId), 1);

      ctx.channels.get(this.channel).send("<@" + playerId + "> " + i18n.getString("LEFT_THE_GAME", this.lang));
  		return true;
  	}

  	return false;
  }

  Game.prototype.getPhrase = function() {
    return this.phrase.noun1+" "+this.phrase.adj1+" "+this.phrase.verb+" "+this.phrase.noun2+" "+this.phrase.adj2;
  }

  Game.prototype.setPlayingOrder = function() {}

  Game.prototype.getStatus = function(lang=null) {
    if (lang == null) lang = this.lang;
    let message = "** " + i18n.getString("STATUS", lang) + " ** \n";

    for (var i = 0; i < Object.keys(this.phrase).length; i++) {
      if (this.phrase[Object.keys(this.phrase)[i]] == "") {
        message += Object.keys(this.phrase)[i] + " " + i18n.getString("IS_BLANK", lang) + " \n";
      }
    }

    for (var i = 0; i < this.players.length; i++) {
      message += "<@" + this.players[i] + "> " + i18n.getString("IS_PLAYING", lang) + " \n";
    }

    return message;
  }

  return Game;
}
