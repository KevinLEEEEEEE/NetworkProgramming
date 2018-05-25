<template>
<div class="fileInput">
  <div class="fileBox" @dragover="dragOver($event)" @drop="drop($event)" ref="fileBox">
    <div class="cutterArea" ref="cutterArea">
      <div class="cutter" draggable="true" ref="cutter" v-show="cutActive"
      @dragstart="dragCutStart($event)"
      @dragend="dragCutEnd($event)"
      @mouseup="resizeBox()"
      ></div>
    </div>
    <label>
      <input type="file" @change="imgChange" :disabled="!fileActive">
    </label>
    <div class="imgContainer" ref="imgContainer">
      <img ref="img">
    </div>
  </div>
  <div class="infoBox">
    <div>
      <p>图片名称</p>
      <input type="text" name="imgName" placeholder="imageName"
              v-model="imgName" :disabled="!infoActive">
      <p>作者</p>
      <input type="text" name="author" placeholder="author"
              v-model="author" :disabled="!infoActive">
      <p>标签</p>
      <input type="text" name="tag" placeholder="use ; for separate"
              v-model="tag" :disabled="!infoActive">
      <div class="tagContainer" v-if="tagsShow">
        <tagBox class="tagItem"
        v-for="(item, index) in tags"
        :tagValue="item"
        :key="index"
        @remove="removeTags(index)"
        ></tagBox>
      </div>
    </div>
    <div>
      <button
      @click="resizeBtn"
      :disabled="!resizeBtnActive"
      :class="[resizeBtnActive ? 'btnA' : 'btnD', 'btn']"
      >{{ cutActive ? 'confirm' : 'resize' }}</button>
      <button
      @click="uploadBtn"
      :disabled="!uploadActive"
      :class="[uploadActive ? 'btnA' : 'btnD', 'btn']"
      >upload</button>
    </div>
  </div>
</div>
</template>

<script>
import fileManager from '../api/fileManager';
import httpManager from '../api/httpManager';
import listManager from '../api/listManager';
import colorManager from '../api/colorManager';
import stateMachine from '../api/stateMachine';
import errorhHandler from '../api/errorhHandler';
import tagBox from '../components/tag';

/* the followings are a test of stateMachine, so instead of using an import
   to create an object, I wrote it directly for easy change and test */
const machine = {
  states: {
    init: 'fileEmpty',
    fileEmpty: ['fileLoading'],
    fileLoading: ['fileAnalysising'],
    fileAnalysising: ['fileReady'],
    fileReady: ['fileLoading', 'trimming', 'fileSending'],
    trimming: ['trimmed'],
    trimmed: ['fileAnalysising', 'fileReady'],
    fileSending: ['fileEmpty'],
  }, // decide the transition methods name and the available directions
  methods: { // each state
    toFileEmpty() {
      this.stateChange({
        fileActive: true,
        infoActive: false,
        cutActive: false,
        resizeActive: false,
        uploadActive: false,
        destoryActive: true,
      });
    },
    toFileLoading() {
      this.stateChange({
        fileActive: false,
        infoActive: false,
        cutActive: false,
        resizeActive: false,
        uploadActive: false,
        destoryActive: false,
      });
    },
    toFileAnalysising() {
      this.stateChange({
        fileActive: false,
        infoActive: true,
        cutActive: false,
        resizeActive: false,
        uploadActive: false,
        destoryActive: false,
      });
    },
    toFileReady() {
      this.stateChange({
        fileActive: true,
        infoActive: true,
        cutActive: false,
        resizeActive: true,
        uploadActive: true,
        destoryActive: true,
      });
    },
    toTrimming() {
      this.stateChange({
        fileActive: false,
        infoActive: true,
        cutActive: true,
        resizeActive: false,
        uploadActive: false,
        destoryActive: false,
      });
    },
    toTrimmed() {
      this.stateChange({
        fileActive: false,
        infoActive: true,
        cutActive: false,
        resizeActive: true,
        uploadActive: false,
        destoryActive: true,
      });
    },
    toFileSending() {
      this.stateChange({
        fileActive: false,
        infoActive: false,
        cutActive: false,
        resizeActive: false,
        uploadActive: false,
        destoryActive: true,
      });
    },
  }, // the function called when state changes
};

export default {
  name: 'fileInput',
  props: {
    globalAuthor: {
      type: String,
      default: 'anonymous',
    }, // use global author as default
  },
  data() {
    return {
      imgName: '',
      author: '',
      tag: '',
      type: '',
      x: 0,
      y: 0,
      percentage: 0,
      package: {}, // package send to server
      active: false,
      resize: false, // is resize available?
      fileActive: true,
      infoActive: false,
      cutActive: false,
      resizeActive: false,
      uploadActive: false,
      destoryActive: false,
    };
  },
  computed: {
    tags() {
      return this.tag.split(';'); // show saperated tags
    },
    tagsShow() {
      return this.tag.length;
    },
    resizeBtnActive() {
      return this.resizeActive || this.cutActive;
    },
  },
  mounted() {
    this.author = this.globalAuthor;
    this.cutter = this.$refs.cutter;
    this.fileBox = this.$refs.fileBox;
    this.cutterArea = this.$refs.cutterArea;
    this.img = this.$refs.img;
    this.imgBox = this.fileBox.getElementsByTagName('img')[0];
    this.fileInput = this.fileBox.getElementsByTagName('input')[0];
    // get dom for further use

    this.stateMachine = stateMachine(machine, this);
  },
  methods: {
    imgChange() {
      const file = this.fileInput.files[0];
      this.handleFile(file);
    },
    drop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    },
    dragOver(event) {
      event.preventDefault();
    },
    handleFile(file) {
      if (!file) return;
      if (this.stateMachine.can('fileLoading')) { // state: fileLoading
        this.stateMachine.state = 'fileLoading';
      } else {
        return;
      }
      const img = this.imgBox;
      this.imgName = file.name; // show name instantly
      this.type = `image/${this.imgName.split('.')[1]}`;
      fileManager.readImgFile(file, img)
        .then((resolve) => {
          const containerWidth = this.$refs.imgContainer.offsetWidth;
          const containerHeigth = this.$refs.imgContainer.offsetHeight;
          this.handleImg(resolve, containerWidth, containerHeigth)
            .then(() => { // set img data in dom successfully, then read and compressed
              const data = fileManager.cutAndCompress(img, this.type, -1, -1, -1, -1);
              // get blob data
              this.package.blob = data.blob;
              this.colorAnalysis(data.context, data.width, data.height);
            }, (reject) => {
              errorhHandler.consoleError(reject);
            });
        }, (reject) => {
          errorhHandler.consoleError(reject);
        });
    },
    handleImg(base64, w, h) {
      const img = this.img;
      img.style.width = '0px';
      img.style.height = '0px'; // reset to prevent sudden change

      return new Promise((resolve, reject) => {
        img.onload = () => {
          let width = img.naturalWidth;
          let height = img.naturalHeight; // get default img size for compress

          if (height > h || width > w) {
            if (width > height) {
              const ratio = width / w; // get radio for equal change
              width = w;
              height /= ratio;
            } else {
              const ratio = height / h;
              width /= ratio;
              height = h;
            }
          }
          img.style.width = `${width}px`; // set new size
          img.style.height = `${height}px`;
          resolve();
        };

        img.onerror = (error) => {
          reject(error);
        };

        img.setAttribute('src', base64);
      });
    },
    colorAnalysis(ctx, width, height) {
      if (this.stateMachine.can('fileAnalysising')) { // state: fileLoading
        this.stateMachine.state = 'fileAnalysising';
      } else {
        return;
      }
      const pixelAmount = width * height;
      if (pixelAmount > 0) {
        const data = ctx.getImageData(0, 0, width, height);
        colorManager.proceessData(data)
          .then((resolve) => {
            // get computed maxHObj(reverse), s, v, rgb
            this.package.colorData = resolve;
            if (this.stateMachine.can('fileReady')) { // state: get blob and rgb data
              this.stateMachine.state = 'fileReady';
            }
          });
      }
    },
    dragCutStart(event) {
      this.x = event.clientX;
      this.y = event.clientY; // drag start position
    },
    dragCutEnd(event) {
      const width = this.cutter.offsetWidth;
      const height = this.cutter.offsetHeight;
      const leftLimit = this.cutterArea.offsetWidth - width;
      const topLimit = this.cutterArea.offsetHeight - height;
      const offsetX = event.clientX - this.x;
      const offsetY = event.clientY - this.y;
      let left = this.cutter.offsetLeft + offsetX;
      let top = this.cutter.offsetTop + offsetY;

      if (left <= 0) {
        left = 0;
      } else if (left >= leftLimit) {
        left = leftLimit;
      }
      if (top <= 0) {
        top = 0;
      } else if (top >= topLimit) {
        top = topLimit;
      }
      this.cutter.style.left = `${left}px`;
      this.cutter.style.top = `${top}px`;
      this.resizeBox();
    },
    resizeBox(invert) {
      if (invert) {
        this.resize = !this.resize;
      }
      const top = this.cutter.offsetTop;
      const left = this.cutter.offsetLeft;
      const width = this.cutter.offsetWidth;
      const height = this.cutter.offsetHeight;
      const topLimit = this.img.offsetTop;
      const leftLimit = this.img.offsetLeft;
      const widthLimit = (this.img.offsetWidth + this.img.offsetLeft) - this.cutter.offsetLeft;
      const heightLimit = this.cutterArea.offsetHeight - this.cutter.offsetTop - topLimit;
      if (top < topLimit) {
        this.cutter.style.top = `${topLimit}px`;
      }
      if (left < leftLimit) {
        this.cutter.style.left = `${leftLimit}px`;
      }
      if (width > widthLimit) {
        this.cutter.style.width = `${widthLimit}px`;
      }
      if (height > heightLimit) {
        this.cutter.style.height = `${heightLimit}px`;
      }
    },
    cut() {
      const img = this.imgBox;
      const width = this.cutter.offsetWidth;
      const height = this.cutter.offsetHeight;
      const toLeft = this.cutter.offsetLeft - this.img.offsetLeft;
      const toTop = this.cutter.offsetTop - this.img.offsetTop;
      const blob = fileManager.cutAndCompress(img, this.type, toLeft, toTop, width, height);
      this.package.blob = blob;
      if (this.stateMachine.can('fileReady')) { // state: fileLoading
        this.stateMachine.state = 'fileReady';
      }
    },
    resizeBtn() {
      if (this.stateMachine.can('trimming')) { // state: fileLoading
        this.stateMachine.state = 'trimming';
      } else if (this.stateMachine.can('trimmed')) {
        this.stateMachine.state = 'trimmed';
        this.cut();
      }
    },
    uploadBtn() { // which means the file has loaded correctlly
      if ('blob' in this.package) {
        if (this.stateMachine.can('fileSending')) { // state: fileLoading
          this.stateMachine.state = 'fileSending';
        } else {
          return;
        }
        const imgName = this.imgName ? this.imgName : 'anonymous';
        const author = this.author ? this.author : this.globalAuthor;
        const tags = this.tags ? this.tags : [];
        this.package.imgName = imgName.split('.')[0];
        this.package.author = author;
        this.package.tags = tags;
        httpManager.sendImage(this.package, this.progress)
          .then((resolve) => {
            // remove node with animation
            // listManager.add(author, imgName, resolve.body, tags);
            this.destory();
          }, (reject) => {
            // do not remove the node, send a error message
            errorhHandler.consoleError(reject);
          });
      }
    },
    destory() {
      this.$emit('remove');
    },
    progress(loaded, total) {
      this.percentage = (loaded / total) * 100;
      console.log(this.percentage);
      // disable the whole node and show the progress animation
    },
    removeTags(index) {
      const tagValue = this.tag.split(';');
      tagValue.splice(index, 1);
      this.tag = tagValue.join(';');
    },
  },
  components: {
    tagBox,
  },
};
</script>

<style>
.fileInput {
  display: flex;
  justify-content: center;
  padding: 0 100px;
}
.fileBox{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: calc(45vw - 100px);
  overflow: hidden;
  border: 1px lightgray solid;
  border-radius: 10px;
}
.fileBox label {
  position: absolute;
  left: 2%;
  top: 2%;
  width: 96%;
  height: 96%;
}
.fileBox .cutterArea {
  position: relative;
  width: 96%;
  height: 96%;
  overflow: hidden;
}
.fileBox .cutter {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  outline: 1000px solid rgba(0, 0, 0, 0.5);
  z-index: 10;
  resize: both;
  overflow: auto;
  cursor: move;
}
.fileBox .cutter::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 15px;
  height: 15px;
  background: skyblue;
  pointer-events: none;
  cursor: s-resize;
}
.fileBox .imgContainer {
  position: absolute;
  left: 2%;
  top: 2%;
  width: 96%;
  height: 96%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  overflow: hidden;
}
.fileBox img {
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.04);
}
input[type="file"] {
  display: none;
}
.infoBox {
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding-left: 20px;
}
.infoBox > div {
  display: flex;
}
.infoBox > div:first-child {
  flex-direction: column;
}
.infoBox > div:nth-child(2) {
  align-self: flex-end;
}
.infoBox p::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 8px;
  background: #e4007f;
}
.infoBox input {
  width: 500px;
  height: 40px;
  margin-left: 20px;
  border: 1px gray solid;
  border-radius: 10px;
  outline: none;
  text-indent: 10px;
}
.tagContainer {
  width: 500px;
  padding: 10px 0 0 20px;
}
.tagItem {
  float: left;
  margin: 5px;
}
.btn {
  width: 90px;
  height: 40px;
  margin-left: 10px;
  border: none;
  border-radius: 40px;
  color: white;
}
.btnA {
  background: #ea68a2;
}
.btnD {
  background: lightgray;
}
input:disabled {
  background: rgba(0, 0, 0, .05);
}
</style>
