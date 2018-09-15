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
}

module.exports = Cheerio;