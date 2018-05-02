<template>
  <div id="mains">
    <div id="imgArea">
      <imgBox class="imgBox"
        v-for="(box, index) in boxes"
        :author="box.author"
        :imgName="box.imgName"
        :imgSrc="box.imgSrc"
        :tags="box.tags"
        :rgb="box.rgb"
        :key="index"
      ></imgBox>
    </div>
    <button @click="download" id="downloadBtn">download</button>
  </div>
</template>

<script>
import listManager from '../api/listManager';
import httpManager from '../api/httpManager';
import errorHandler from '../api/errorhHandler';
import imgBox from '../components/imgBox';

export default {
  name: 'download',
  data() {
    return {
      boxes: [],
      downloadAmount: 2,
    };
  },
  methods: {
    download() {
      httpManager.checkList(this.downloadAmount).then((res) => {
        const list = res.body;
        for (let index = list.length - 1; index >= 0; index -= 1) {
          const currentList = list[index];
          const { md5, tags, author, imgName, rgb, type } = currentList;

          listManager.add({
            author,
            imgName,
            md5,
          });

          this.insertImgBox({
            author,
            imgName,
            imgSrc: `./img/${md5}_small.${type}`,
            md5,
            tags,
            rgb,
          });
        }
      }, (reject) => {
        errorHandler.consoleError(reject);
      });
    },
    insertImgBox(imgObj) {
      this.boxes.push(imgObj);
    },
  },
  components: {
    imgBox,
  },
};
</script>

<style scoped>
#mains {
  padding: 0 5%;
  background: rgba(0, 0, 0, .1);
  overflow: hidden;;
}
#inputArea{
  display: flex;
  flex-direction: row;
}
.imgBox {
  float: left;
  margin: 0 5px 70px 5px;
}
#downloadBtn {
  width: 100px;
  height: 100px;
  margin: 100px 0 50px calc(50% - 50px);
}
</style>
