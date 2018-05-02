const _fileManager = {
  compressToBlob(img, fileType, sx, sy, swidth, sheight) {
    const cvs = document.createElement('canvas');
    const context = cvs.getContext('2d');
    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (sx !== -1 && sy !== -1) {
      const boxWidth = parseInt(img.style.width, 10);
      const boxHeight = parseInt(img.style.height, 10);
      const widthRadio = width / boxWidth;
      const heightRadio = height / boxHeight;
      const Swidth = swidth * widthRadio;
      const Sheight = sheight * heightRadio;

      width = Swidth;
      height = Sheight;
    }

    cvs.width = width;
    cvs.height = height;

    context.drawImage(img, 0, 0, width, height, 0, 0, width, height);

    const newImageData = cvs.toDataURL(fileType);
    const blob = _fileManager.dataURLtoBlob(newImageData, fileType);

    return {
      blob,
      context,
      width,
      height,
    };
  },
  dataURLtoBlob(dataURL, fileType) {
    const byteString = atob(dataURL.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let index = 0; index < byteString.length; index += 1) {
      ia[index] = byteString.charCodeAt(index);
    }
    return new Blob([ab], { type: fileType });
  },
};

const fileManager = {
  readImgFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(file);

      if (file.type.split('/')[0] !== 'image') {
        reject();
      }

      reader.onload = (event) => {
        const base64 = event.target.result;
        resolve(base64);
      };
      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  },
  cutAndCompress(img, fileType, sx, sy, swidth, sheight) {
    const blob = _fileManager.compressToBlob(img, fileType, sx, sy, swidth, sheight);
    return blob;
  },
};

export default fileManager;
