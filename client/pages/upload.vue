<template>
  <div id="uploadPage">
    <div id="authorArea">
      <img src="../../static/author.png">
      <input id="author" type="text" placeholder="author" v-model="author">
    </div>
    <div id="inputArea">
      <fileInput class="fileInput"
      v-for="(item, index) in fileList"
      :globalAuthor="item.globalAuthor"
      :key="item.index"
      @remove="removeInput(index)"
      ></fileInput>
      <div @click="addInput" id="addBtn">+</div>
    </div>
  </div>
</template>

<script>
import fileInput from '../components/fileInput';

export default {
  name: 'upload',
  data() {
    return {
      fileList: [],
      author: '',
      total: 0,
    };
  },
  mounted() {
    this.addInput(); // create first upload box when mounted to dom tree
  },
  methods: {
    addInput() { // bad code! better expressions now
      this.fileList.push({
        globalAuthor: this.author,
        index: this.total += 1,
      });
    },
    removeInput(index) {
      this.fileList.splice(index, 1); // removw event
    },
  },
  components: {
    fileInput,
  },
};
</script>

<style scoped>
#uploadPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, .1);
}
#authorArea {
  display: flex;
  align-items: center;
  position: absolute;
  right: 20px;
  top: 10px;
}
#authorArea img {
  width: 40px;
  border: 1px solid white;
  border-radius: 100%;
}
#author {
  width: 50px;
  margin-left: 10px;
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, .8);
}
#inputArea {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;
  margin: 60px 0;
  border-radius: 30px;
  background: white;
}
.fileInput {
  margin-top: 100px;
}
#addBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 100px;
  height: 100px;
  margin: 200px 0 80px 0;
  border-radius: 100px;;
  background: #ea68a2;
  color: white;
  font-size: 2.5rem;
  font-weight: 100;
}

</style>
