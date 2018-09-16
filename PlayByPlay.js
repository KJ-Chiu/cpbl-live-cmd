const Request = require('./Request');
const Cheerio = require('./Cheerio');
const colors = require('colors');

class PlayByPlay {
  init (gameId, gameDate, pbyear, data) {
    this.gameId = gameId;
    this.gameDate = gameDate;
    this.pbyear = pbyear;
    this.initData = data;
    this.refresh();
  }

  refresh () {
    return setTimeout(() => {
      return this.getData();
    }, 2000);
  }

  getData () {
    return this.refresh();
  }
}

module.exports = PlayByPlay;