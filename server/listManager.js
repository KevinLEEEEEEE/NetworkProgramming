const imgList = [];
const authorToMd5 = {};
const md5ToAuthor = {};
const imgNameToMd5 = {};
const md5ToImgName = {};
const md5ToTags = {};
const tagsToMd5 = {};
const md5ToType = {};
const md5ToRGB = {};
// const md5ToH = {};
// const md5ToS = {};
// const md5ToV = {};

const _listManager = {
  addToLists(author, imgName, md5, tags, colorData, type) {
    this.list(md5, type);
    this.atm(author, md5);
    this.mta(md5, author);
    this.ntm(imgName, md5);
    this.mtn(md5, imgName);
    this.mtt(md5, tags);
    this.ttm(tags, md5);
    this.mtrgb(md5, colorData.rgb);
  },
  list(md5, type) {
    imgList.push(md5);
    md5ToType[md5] = type;
  },
  atm(author, md5) {
    if (!(author in authorToMd5)) {
      authorToMd5[author] = [];
    }
    authorToMd5[author].push(md5);
  },
  mta(md5, author) {
    md5ToAuthor[md5] = author;
  },
  ntm(imgName, md5) {
    imgNameToMd5[imgName] = md5;
  },
  mtn(md5, imgName) {
    md5ToImgName[md5] = imgName;
  },
  mtt(md5, tags) {
    md5ToTags[md5] = tags;
  },
  ttm(tags, md5) {
    tags.forEach((tag) => {
      if (!(tag in tagsToMd5)) {
        tagsToMd5[tags] = [];
      }
      tagsToMd5[tags].push(md5);
    });
  },
  mtrgb(md5, rgb) {
    md5ToRGB[md5] = rgb;
  },
  getRandom(amount) {
    return Math.floor(Math.random() * amount);
  },
};

const listManager = {
  add(info) {
    const { author, imgName, md5, tags, type, colorData } = info;
    _listManager.addToLists(author, imgName, md5, tags, colorData, type);
  },
  getImgList() {
    return imgList;
  },
  getByAuthor(author) {
    return authorToMd5[author];
  },
  getAuthor(md5) {
    return md5ToAuthor[md5];
  },
  getByImgName(imgName) {
    return imgNameToMd5[imgName];
  },
  getImgName(md5) {
    return md5ToImgName[md5];
  },
  getTags(md5) {
    return md5ToTags[md5];
  },
  getByTags(tags) {
    let list = [];
    tags.forEach((tag) => {
      if (tag in tagsToMd5) {
        list += tagsToMd5[tag];
      }
    });
    return list;
  },
  getType(md5) {
    return md5ToType[md5];
  },
  getRGB(md5) {
    return md5ToRGB[md5];
  },
  giveMeList(tmpList, amount) {
    console.log(`tmpList: ${tmpList}`);
    const length = imgList.length;
    const rest = length - amount;
    const sendList = [];
    let trueAmount = rest >= 0 ? amount : rest;
    while (trueAmount > 0) {
      const random = _listManager.getRandom(length);
      const randomImg = imgList[random];
      if (tmpList.indexOf(randomImg) === -1 && sendList.indexOf(randomImg) === -1) {
        const author = listManager.getAuthor(randomImg);
        const imgName = listManager.getImgName(randomImg);
        const tags = listManager.getTags(randomImg);
        const type = listManager.getType(randomImg);
        const rgb = listManager.getRGB(randomImg);
        const infoObj = {
          author,
          imgName,
          tags,
          md5: randomImg,
          rgb,
          type,
        };
        sendList.push(infoObj);
        trueAmount -= 1;
      }
    }
    console.log(sendList);
    return sendList;
  },
};

module.exports = listManager;
