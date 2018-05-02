import Vue from 'vue';
import listManager from './listManager';

const _httpManager = {
  upload(formData, callback) {
    return new Promise((resolve, reject) => {
      Vue.http.post('/api/file/upload', formData, {
        uploadProgress(event) {
          callback(event.loaded, event.total);
        },
      })
        .then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  },
};

const httpManager = {
  sendImage(packages, callback) {
    const formData = new FormData();
    console.log(packages.blob);
    formData.append('file', packages.blob.blob || packages.blob);
    formData.append('imgName', packages.imgName);
    formData.append('author', packages.author);
    formData.append('tags', packages.tags);
    formData.append('colorData', JSON.stringify(packages.colorData));
    return _httpManager.upload(formData, callback);
  },
  checkList(amount) {
    const tmpList = listManager.getImgList();
    return new Promise((resolve, reject) => {
      Vue.http.post('/api/file/checkList', {
        tmpList,
        amount,
      }).then((res) => {
        console.log(res);
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  },
  download_small(md5) {
    return new Promise((resolve, reject) => {
      Vue.http.get(`/api/file/detail/${md5}`)
        .then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  },
};

export default httpManager;
