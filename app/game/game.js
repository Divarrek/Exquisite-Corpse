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
}

Game.prototype.join = function(playerId) {
    this.players.push(playerId);
};

Game.prototype.getStatus = function(i18n, lang=null) {
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

module.exports = Game;
