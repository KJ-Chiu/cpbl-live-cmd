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
}

module.exports = Cheerio;