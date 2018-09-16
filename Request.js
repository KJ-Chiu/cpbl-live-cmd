const request = require('request');

class Request {
  constructor () {
    this.scheduleUrl = 'http://www.cpbl.com.tw/schedule/index/';
    this.scheduleUrlAppend = '.html?gameno=01&sfieldsub=&sgameno=01&date=';

    this.playByPlayUrl = 'http://www.cpbl.com.tw/games/play_by_play.html?&game_type=01';
  }

  schedule (targetDate, callback) {
    console.log('Now connecting to cpbl schedule...');
    request({
      url:  this.scheduleUrl + targetDate + this.scheduleUrlAppend + targetDate,
      method: 'GET'
    }, function (e, r, b) {
      if (e || !b) {
        console.error('[ERROR] Can\'t get data from cpbl schedule, stop.');
        return callback(false);
      }
      console.log('Successfully get game schedule from cpbl');
      return callback(b);
    });
  }

  gamePlayByPlay (gameId, gameDate, pbyear, callback) {
    request({
      url:  `${this.playByPlayUrl}&game_id=${gameId}&game_date=${gameDate}&pbyear=${pbyear}`,
      method: 'GET'
    }, function (e, r, b) {
      if (e || !b) {
        console.error('[ERROR] Can\'t get data from cpbl play by play, stop.');
        return callback(false);
      }
      return callback(b);
    });
  }
}

module.exports = Request;