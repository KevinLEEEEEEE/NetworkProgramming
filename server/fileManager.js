const fs = require('fs');
const MD5 = require('crypto-js/md5');
const path = require('path');
const gm = require('gm');

const _fileManager = {
  rename(oldPath, author, imgName, tags, colorData, type, resolve, reject) {
    const md5 = this.getMD5(author, imgName, tags);
    const newPath = path.join(__dirname, `../dist/img/${md5}.${type}`);
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.log('rename error');
        reject(err);
      } else {
        this.thumbnail(md5, newPath, type);
        console.log('rename and move file successfully');
        resolve({
          author,
          imgName,
          md5,
          tags,
          type,
          colorData,
        });
      }
    });
  },
  getMD5(author, imgName, tags) {
    return MD5(author + imgName + tags + new Date()).words.join('');
  },
  thumbnail(md5, newPath, type) {
    gm(newPath)
      .resize(300, 300, '>')
      .strip()
      .autoOrient()
      .write(path.join(__dirname, `../dist/img/${md5}_small.${type}`),
        (err) => {
          if (err) {
            console.log(`resize error: ${err}`);
          }
        });
  },
};

const fileManager = {
  add(fields, file, resolve, reject) {
    const type = file.type.split('/')[1];
    const oldPath = `./${file.path}`;
    const author = fields.author;
    const imgName = fields.imgName;
    const tags = fields.tags.split(',');
    const colorData = JSON.parse(fields.colorData);
    _fileManager.rename(oldPath, author, imgName, tags, colorData, type, resolve, reject);
  },
};

module.exports = fileManager;
