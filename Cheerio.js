const cheerio = require('cheerio');

class Cheerio {
  setData (data, month) {
    this.data = data;
    this.month = parseInt(month);
    this.filterData = [];
  }

  filterSchedule () {
    const $ = cheerio.load(this.data);
    let schedule = $('.schedule').first('tbody');
    this.beforeMonth = -1;// -1: 前一個月； 0: 當月； 1: 下個月
    // 日期欄
    $(schedule).children().children('tr').children('th').each((i, elem) => {
      if ($(elem).hasClass('past') || $(elem).hasClass('today') || $(elem).hasClass('future')) {
        this.filterScheduleDate($(elem));
      }
    });
    // 賽程欄
    $(schedule).children().children('tr').children('td').each((i, elem) => {
      let data = this.filterData[i];
      this.filterData[i] = this.filterScheduleGame($(elem), data);
    });

    return this.showSchedule();
  }

  filterScheduleDate (dateColumn) {
    const $ = cheerio.load(this.data);
    let date = parseInt($(dateColumn).html());
    if (1 == date) {
      this.beforeMonth += 1;
    }

    let month = this.month + this.beforeMonth;
    if (10 > month) {
      month = '0' + month;
    }
    if (10 > date) {
      date = '0' + date;
    }

    this.filterData.push({
      month: month,
      date: month + '/' + date
    });
  }

  filterScheduleGame (dataColumn, gameInfo) {
    const $ = cheerio.load(this.data);
    gameInfo.games = [];
    $(dataColumn).children('div').each((i, elem) => {
      let perGame = {};

      // 對戰組合
      $(elem).find('.schedule_team').children('tbody').children('tr').children('td').each((j, subElem) => {
        if (0 == j) {
          perGame.away = this.teamCodeToName($(subElem).children('img').attr('src'));
        }

        if (1 == j) {
          perGame.place = $(subElem).text();
        }

        if (2 == j) {
          perGame.home = this.teamCodeToName($(subElem).children('img').attr('src'));
        }
      });

      // 比賽編號
      $(elem).find('.schedule_info').first().children('tbody').children('tr').children('th').each((j, subElem) => {
        if (1 == j) {
          perGame.code = $(subElem).text();
        }
      });
      gameInfo.games.push(perGame);
    });
    return gameInfo;
  }

  // 由於賽程表上面沒有名稱，故只能利用圖檔的 src 來做分類
  teamCodeToName (imgSrc) {
    if (imgSrc.includes('B')) {
      return '富邦';
    }

    if (imgSrc.includes('L')) {
      return '統一';
    }

    if (imgSrc.includes('E')) {
      return '中信';
    }

    if (imgSrc.includes('A')) {
      return '桃猿';
    }

    return '未知';
  }

  showSchedule () {
    let week = 0;
    let weekChinese = [
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '日',
    ];

    this.filterData.forEach(perDay => {
      // 非當月份不會有比賽資訊，過濾掉
      if (perDay.month != this.month) {
        week++;
        week = week % 7;
        return;
      }

      console.log(' ');
      let date = `|| ${perDay.date} (${weekChinese[week]}) ||`;
      let line = date;

      let gameCount = 0;
      perDay.games.forEach(game => {
        // 超過兩場會有點太長，切割做下一行
        gameCount++;
        if (2 < gameCount) {
          gameCount = 1;
          console.log(line);
          line = date;
        }

        // 產生比賽資訊
        let code = game.code;
        if (10 > parseInt(code)) {
          code = '00' + code;
        }
        if (100 > parseInt(code)) {
          code = '0' + code;
        }
        let place = game.place;
        if (2 == place.length) {
          place = ` ${place} `;
        }
        line += ` ${game.away} v.s. ${game.home} [${code}][${place}] ||`;
      });

      console.log(line);
      week++;
      week = week % 7;
    });
    console.log(' ');
  }

  filterPlayByPlay (data) {
    this.data = data;
    const $ = cheerio.load(this.data);
    let pbp = $(this.data).find('.gap_b20').children('table').children('tbody');

    let playByPlay = [];
    let currentInning = -1;
    $(pbp).children('tr').each((i, elem) => {
      // 局數
      if (0 < $(elem).children('th').length) {
        playByPlay.push({
          inning: $(elem).children('th').eq(0).text(),
          play: []
        });
        currentInning++;
        return;
      }

      // 說明
      if ($(elem).hasClass('change')) {
        playByPlay[currentInning]['play'].push({
          type: 'comment',
          text: $(elem).children('td').eq(1).text()
        });
        return;
      }

      // play by play
      if (0 < $(elem).children('td').length) {
        playByPlay[currentInning]['play'].push({
          type: 'game',
          order: $(elem).children('td').eq(0).text(),
          text: $(elem).children('td').eq(1).text()
        });
        return;
      }
    });
    return playByPlay;
  }

  filterScoreBoard (data) {
    const $ = cheerio.load(data);
    let value = {
      away: {},
      home: {}
    };
    let scoreBoard = $(data).find('.score_board').first();
    $(scoreBoard).children('div').each((i, elem) => {
      let trs =  $(elem).children('table').children('tbody').children('tr');
      // 比數 - 球隊
      if (0 == i) {
        value.away.team = $(trs).eq(1).children('td').text();
        value.home.team = $(trs).eq(2).children('td').text();
      }

      // 比數 - 比數
      if (1 == i) {
        value.away.score = [];
        value.home.score = [];
        $(trs).eq(1).children('td').each((j, subElem) => {
          value.away.score.push($(subElem).children('span').text());
        });
        $(trs).eq(2).children('td').each((j, subElem) => {
          value.home.score.push($(subElem).children('span').text());
        });
      }

      // 比數 - RHE
      if (2 == i) {
        value.away.R = $(trs).eq(1).children('td').eq(0).text();
        value.away.H = $(trs).eq(1).children('td').eq(1).text();
        value.away.E = $(trs).eq(1).children('td').eq(2).text();

        value.home.R = $(trs).eq(2).children('td').eq(0).text();
        value.home.H = $(trs).eq(2).children('td').eq(1).text();
        value.home.E = $(trs).eq(2).children('td').eq(2).text();
      }
    });

    return value;
  }
}

module.exports = Cheerio;