const express = require('express');
const formidable = require('formidable');
const fileManager = require('../fileManager');
const listManager = require('../listManager');
const httpManager = require('../httpManager');

const router = express.Router();

router.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = './';
  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    const key = Object.keys(files)[0];
    new Promise((resolve, reject) => {
      fileManager.add(fields, files[key], resolve, reject);
    })
      .then((resolve) => {
        listManager.add(resolve);
        httpManager.jsonp(res, resolve.md5);
      }, (reject) => {
        httpManager.send404(res, { reject });
      })
      .catch(new Function());
  });
});

router.post('/checkList', (req, res) => {
  const body = req.body;
  const tmpList = body.tmpList;
  const amount = body.amount;
  const list = listManager.giveMeList(tmpList, amount);
  httpManager.jsonp(res, list);
});

router.get('/download/*', (req, res) => {
  const md5 = req.url.split('/')[2];
  console.log(md5);
  httpManager.sendFile(res, md5);
});

router.get('/detail/*', (req, res) => {
  const md5 = req.url.split('/')[2];
  const author = listManager.getAuthor(md5);
  const imgName = listManager.getImgName(md5);
  console.log(author, imgName);
  httpManager.jsonp(res, {
    author,
    imgName,
  });
});

module.exports = router;
