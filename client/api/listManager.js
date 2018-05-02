const imgList = [];
const authorToMd5 = {};
const md5ToAuthor = {};
const imgNameToMd5 = {};
const md5ToImgName = {};
const md5ToTags = {};
const tagsToMd5 = {};

const _listManager = {
  addToLists(author, imgName, md5, tags) {
    this.list(md5);
    this.atm(author, md5);
    this.mta(md5, author);
    this.ntm(imgName, md5);
    this.mtn(md5, imgName);
    this.mtt(md5, tags);
    this.ttm(tags, md5);
  },
  list(md5) {
    imgList.push(md5);
  },
  atm(author, md5) {
    if (author in authorToMd5) {
      authorToMd5[author].push(md5);
    } else {
      authorToMd5[author] = [];
      authorToMd5[author].push(md5);
    }
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
};

const listManager = {
  add(author, imgName, md5, tags) {
    _listManager.addToLists(author, imgName, md5, tags);
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
    return imgNameToMd5(imgName);
  },
  getImgName(md5) {
    md5ToImgName(md5);
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
};

export default listManager;
