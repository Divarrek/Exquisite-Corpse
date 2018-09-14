let i18n = {
  defaultLang : "en",
  strings : null,
  sourcePath : "",
  setSourcePath : function(sourcePath) {
    this.sourcePath = sourcePath;
    this.strings = require.main.require(sourcePath);
  },
  getString : function(key, lang=null) {
    if (this.strings === null) {
      console.error("i18n not initialized");
    } else {
      if (lang === null) {
        return this.strings[key][this.defaultLang];
      } else {
        return this.strings[key][lang];
      }
    }
  }
}

module.exports = i18n;
