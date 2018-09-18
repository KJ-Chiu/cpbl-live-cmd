class Tools {
  static strRealLength (str) {
    let n = str.length;
    let s = '';
    let len = 0;
    for (let i = 0; i < n; i++) {
     s = str.charCodeAt(i);
     while (s > 0) {
        len++;
        s = s >> 8;
     }
    }
    return len;
  }
}

module.exports = Tools;