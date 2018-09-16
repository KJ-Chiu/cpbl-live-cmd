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
    let cheerio = new Cheerio();
    let all = cheerio.filterPlayByPlay(this.initData);

    // 已經結束的比賽
    if ('1上' == all[0].inning) {
      return this.finishedGame(all);
    }

    return this.refresh();
  }

  finishedGame (all) {
    all.forEach(inning => {
      console.log(' ');
      console.log(`現在局數: ${inning.inning}`.bold.yellow)
      inning.play.forEach(perPlay => {
        console.log(' ');
        if ('comment' == perPlay.type) {
          return console.log(' '.bgYellow + ` ${perPlay.text} ` + ' '.bgYellow);
        }

        if ('game' == perPlay.type) {
          return console.log(' '.bgWhite + ` ${perPlay.text} ` + ' '.bgWhite);
        }
      });
    });

    console.log('\n 比賽結束 \n'.bold.yellow);
    return console.log('Command: (S) to see score board, (Q) to quit game: \n');
  }
}

module.exports = PlayByPlay;