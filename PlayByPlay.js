const Request = require('./Request');
const Cheerio = require('./Cheerio');
const colors = require('colors');
const Effect = require('./Effect');

class PlayByPlay {
  init (gameId, gameDate, pbyear, data) {
    this.gameId = gameId;
    this.gameDate = gameDate;
    this.pbyear = pbyear;
    this.data = data
    this.filterData = [];
    this.keep = true;
    this.getData();
  }

  stop () {
    this.keep = false;
  }

  refresh () {
    return setTimeout(() => {
      if (!this.keep) {
        return;
      }

      let request = new Request();
      request.gamePlayByPlay(this.gameId, this.gameDate, this.pbyear, (data) => {
        if (false === data) {
          closeReadLine();
        }

        this.data = data;
        return this.getData();
      });
    }, 10000);
  }

  getData () {
    if (!this.keep) {
      return;
    }

    let cheerio = new Cheerio();
    let all = cheerio.filterPlayByPlay(this.data);

    // 已經結束的比賽
    if ('1上' == all[0].inning) {
      return this.finishedGame(all);
    }

    this.concatData(all);
    return this.refresh();
  }

  concatData (all) {
    let oldFilterData = this.filterData;

    // 反過來看，因為正在進行的球賽最新的局數會放最上面
    for (let index = all.length - 1; index >= 0; index--) {
      let inning = all[index];
      let inningNum = all.length - index;
      // 已經結束的局數
      if (inningNum < oldFilterData.length) {
        continue;
      }

      // 正在進行的局數
      if (inningNum == oldFilterData.length) {
        inning.play.forEach(perPlay => {
          // 已經儲存過的不輸出，(不用長度檢查是因為有時候內容單一 play 內容會變動)
          if (this.playExist(perPlay, oldFilterData[inningNum - 1].play)) {
            return;
          }

          oldFilterData[inningNum].push(perPlay);
          this.consolePlay(perPlay);
        });
        continue;
      }

      // 已經結束的局數
      oldFilterData.push(inning);
      this.consoleInning(inning.inning);
      inning.play.forEach(perPlay => {
        this.consolePlay(perPlay);
      });
      continue;
    };

    this.filterData = oldFilterData;
    return;
  }

  playExist (play, alreadyPlays) {
    let exist = false;
    alreadyPlays.forEach(alreadyPlay => {
      if (alreadyPlay.type == play.type && alreadyPlay.text == play.text) {
        exist = true;
      }
      return;
    });
    return exist;
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
      if (play.text.includes('全壘打')) {
        Effect.homerun();
      }
      return console.log(' '.bgWhite + ` ${play.text} ` + ' '.bgWhite);
    }
  }
}

module.exports = PlayByPlay;