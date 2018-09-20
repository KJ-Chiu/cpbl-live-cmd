console.log('歡迎來到 CPBL LIVE CMD 及時賽況，請稍後...');
console.log('\nType "exit" anytime if try to leave');
const Request = require('./Request');
const Cheerio = require('./Cheerio');
const PlayByPlay = require('./PlayByPlay');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const playByPlay = new PlayByPlay();
const today = new Date();
let todayYear = today.getFullYear();
let todayMonth = today.getMonth() + 1;
if (10 > todayMonth) {
  todayMonth = '0' + todayMonth;
}
let todayDate = today.getDate();
if (10 > todayDate) {
  todayDate = '0' + todayDate;
}

askFirstStep = () => {
  rl.question('Start with game id(1) or Search by date(2) or (today) to see live game? (1 or 2 or today) ', (answer) => {
    if ('exit' == answer) {
      return closeReadLine();
    }

    if ('today' == answer) {
      return gameToday();
    }

    if (1 !=  answer && 2 != answer) {
      console.log('Great, please type again.');
      return askFirstStep();
    }

    if (2 == answer) {
      console.log('You choose: Search by date');
      return searchByDate();
    }

    console.log('You choose: Start with game id');
    return startWithGameId();
  });
}

gameToday = () => {
  console.log('Start searching today\'s game');
  let todayFormat = `${todayYear}-${todayMonth}-${todayDate}`;
  let request = new Request();
  request.schedule(todayFormat, (data) => {
    if (false === data) {
      closeReadLine();
    }
    let cheerio = new Cheerio();
    cheerio.setData(data, todayMonth, todayDate, true);
    let value = cheerio.filterSchedule();
    if (value.gameId) {
      return startGame(value.gameId, todayFormat);
    }
    return console.log('今日沒有比賽唷！');
  });
}

searchByDate = () => {
  let todayFormat = `${todayYear}-${todayMonth}-${todayDate}`;
  rl.question(`Please enter target date like following format (${todayFormat}): `, (answer) => {
    if ('exit' == answer) {
      return askFirstStep();
    }

    if (!dateValidation(answer)) {
      console.log('Wrong format, please type again.');
      return searchByDate();
    }
    let targetMonth = answer.split('-')[1];
    let targetDate = answer.split('-')[2];

    let request = new Request();
    let data = request.schedule(answer, (data) => {
      if (false === data) {
        closeReadLine();
      }
      let cheerio = new Cheerio();
      cheerio.setData(data, targetMonth, targetDate);
      cheerio.filterSchedule();
      return askFirstStep();
    });
  });
}

startWithGameId = () => {
  let todayFormat = `${todayYear}-${todayMonth}-${todayDate}`;
  rl.question(`Please enter game Id and game date like following format (123 ${todayFormat}): `, (answer) => {
    if ('exit' == answer) {
      return askFirstStep();
    }

    answer = answer + ' ';
    let value = answer.split(' ');
    let gameId = value[0];
    let gameDate = value[1];
    if (!parseInt(gameId) || !dateValidation(gameDate)) {
      console.log('Wrong format, please type again.');
      return startWithGameId();
    }

    return startGame(gameId, gameDate);
  });
}

startGame = (gameId, gameDate) => {
  console.log(`Start to search game ${gameId} at ${gameDate}`);
  let pbyear = gameDate.split('-')[0];
  let request = new Request();
  request.gamePlayByPlay(gameId, gameDate, pbyear, (data) => {
    if (false === data) {
      closeReadLine();
    }

    playByPlay.init(gameId, gameDate, pbyear, data);
    return stayWaiting();
  });
}

stayWaiting = () => {
  rl.question(`Command: (S) to see score board, (Q) to quit game: \n`, (answer) => {
    answer = answer.toUpperCase();
    if ('Q' == answer || 'EXIT' == answer) {
      playByPlay.stop();
      return askFirstStep();
    }

    if ('HELP' == answer) {
      return stayWaiting();
    }

    if ('S' == answer) {
      playByPlay.scoreBoard();
      return stayWaiting();
    }
  });
}

dateValidation = (date) => {
  let dateArray = date.split('-');
  if (3 !== dateArray.length) {
    return false;
  }

  dateArray.forEach(element => {
    element = parseInt(element);
    if (!element) {
      return false;
    }
  });

  return true;
}

closeReadLine = () => {
  console.log('--- CPBL LIVE CMD ---');
  console.log('此專案由 KJ Chiu 製作');
  console.log('歡迎來我的 github 看看還有甚麼有趣的作品吧～ https://github.com/KJ-Chiu');
  return rl.close();
}

askFirstStep();