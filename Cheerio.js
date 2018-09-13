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
    $(schedule).children().children('tr').children('th').each((i, elem) => {
      // 日期欄
      if ($(elem).hasClass('past') || $(elem).hasClass('today') || $(elem).hasClass('future')) {
        this.filterScheduleDate($(elem));
      }
    });
  }

  filterScheduleDate (dateColumn) {
    const $ = cheerio.load(this.data);
    console.log($(dateColumn).html());
  }
}

module.exports = Cheerio;