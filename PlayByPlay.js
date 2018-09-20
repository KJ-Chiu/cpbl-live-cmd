const Request = require('./Request');
const Cheerio = require('./Cheerio');
const colors = require('colors');
const Effect = require('./Effect');
const Tools = require('./Tools');

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
    if (0 == all.length) {
      return console.log('比賽不存在或尚未開打'.bold.red);
    }

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

          oldFilterData[inningNum - 1].play.push(perPlay);
          this.consolePlay(perPlay);
        });
        continue;
      }

      // 剛開始的局數
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

    console.log('\n 比賽結束 \n'.bold.yellow);
    return this.scoreBoard();
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

  scoreBoard () {
    let cheerio = new Cheerio();
    let filterScoreBoard = cheerio.filterScoreBoard(this.data);
    if (!filterScoreBoard.away.score || !filterScoreBoard.home.score) {
      return console.log('比賽不存在或尚未開打'.bold.red);
    }

    let moreThanNine = '';
    if (9 < filterScoreBoard.away.score.length) {
      moreThanNine = '| X ';
    }

    let awayNameLen = Tools.strRealLength(filterScoreBoard.away.team);
    let homeNameLen = Tools.strRealLength(filterScoreBoard.home.team);
    let teamNameLen = (awayNameLen > homeNameLen) ? awayNameLen : homeNameLen;
    let teamNameSpace = ' ';
    for (let i = 0; i < teamNameLen; i++) {
      teamNameSpace += ' ';
    }
    teamNameSpace += ' ';
    console.log(`  ${teamNameSpace}  `.bgWhite);
    console.log(`||${teamNameSpace}|| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ${moreThanNine}|| R | H | E ||`);
    console.log();
    console.log(this.scoreBoardConsole(filterScoreBoard.away, teamNameLen));
    console.log(this.scoreBoardConsole(filterScoreBoard.home, teamNameLen));
    console.log(`  ${teamNameSpace}  `.bgWhite);
  }

  scoreBoardConsole (team, teamNameMaxLen) {
    let name = team.team;
    let score = team.score;
    let line = '|| ';

    let nameLen = Tools.strRealLength(name);
    let spaceNeed = teamNameMaxLen - nameLen;
    let spaceNeedFront = parseInt(spaceNeed / 2);
    let spaceNeedBack = spaceNeed - spaceNeedFront;
    for (let i = 0; i < spaceNeedFront; i++) {
      line += ' ';
    }
    line += name;
    for (let i = 0; i < spaceNeedBack; i++) {
      line += ' ';
    }
    line += ' ||';

    score.forEach(element => {
      line += this.numberOutputForThreeSpace(element) + '|';
    });
    line += '|';

    line += this.numberOutputForThreeSpace(team.R) + '|';
    line += this.numberOutputForThreeSpace(team.H) + '|';
    line += this.numberOutputForThreeSpace(team.E) + '||';
    return line;
  }

  numberOutputForThreeSpace (number) {
    if (isNaN(parseInt(number))) {
      number = '  ';
    } else if (10 > parseInt(number)) {
      number += ' ';
    }

    number = ' ' + number;
    return number;
  }
}

module.exports = PlayByPlay;