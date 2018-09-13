const request = require('request');

class Request {
  constructor () {
    this.scheduleUrl = 'http://www.cpbl.com.tw/schedule/index/';
    this.scheduleUrlAppend = '.html?gameno=01&sfieldsub=&sgameno=01&date=';
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
}

module.exports = Request;