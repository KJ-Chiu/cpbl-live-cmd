const Request = require('./Request');
const Cheerio = require('./Cheerio');
const colors = require('colors');

class PlayByPlay {
  init (gameId, gameDate, pbyear, data) {
    this.gameId = gameId;
    this.gameDate = gameDate;
    this.pbyear = pbyear;
    this.data = data
    this.filterData = [];
    this.getData();
  }

  refresh () {
    return setTimeout(() => {
      return this.getData();
    }, 2000);
  }

  getData () {
    let cheerio = new Cheerio();
    let all = cheerio.filterPlayByPlay(this.data);

    // 已經結束的比賽
    if ('1上' == all[0].inning) {
      return this.finishedGame(all);
    }

    return this.refresh();
  }

  finishedGame (all) {
    all.forEach(inning => {
      this.consoleInning(inning.inning);
      inning.play.forEach(perPlay => {
        this.consolePlay(perPlay);
      });
    });

    return console.log('\n 比賽結束 \n'.bold.yellow);
  }

  consoleInning (inning) {
    console.log(' ');
    console.log(`現在局數: ${inning}`.bold.yellow);
  }

  consolePlay (play) {
    console.log(' ');
    if ('comment' == play.type) {
      return console.log(' '.bgYellow + ` ${play.text} ` + ' '.bgYellow);
    }

    if ('game' == play.type) {
      return console.log(' '.bgWhite + ` ${play.text} ` + ' '.bgWhite);
    }
  }
}

module.exports = PlayByPlay;