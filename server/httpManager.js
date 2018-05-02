const path = require('path');

const httpManager = {
  jsonp(res, value) {
    res.jsonp(value);
  },
  send404(res, value) {
    res.jsonp(value);
  },
  sendFile(res, md5) {
    res.sendFile(path.join(__dirname, `../dist/img/${md5}.jpg`));
  },
};

module.exports = httpManager;
