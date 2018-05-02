<template>
  <div class="imgBoxContainer">
    <div class="imgBox">
      <img :src="imgSrc" width="300px">
    </div>
    <div class="content">
      <div class="upContent">
        <span>{{ imgName }}</span>
        <span>{{ author }}</span>
      </div>
      <div class="downContent">
        {{ tagsShow }}
        <div class="likes">
          <img src="../../static/likes.png">
          <span>1123 likes</span>
        </div>
      </div>
      <div class="colorBanner">
        <div class="colorBlock" ref="b1"></div>
        <div class="colorBlock" ref="b2"></div>
        <div class="colorBlock" ref="b3"></div>
        <div class="colorBlock" ref="b4"></div>
        <div class="colorBlock" ref="b5"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'imgBox',
  props: {
    imgSrc: {
      type: String,
      default: '../public/tets.jpeg',
    },
    author: {
      type: String,
      default: 'niming',
    },
    imgName: {
      type: String,
      default: 'niming',
    },
    rgb: {
      type: Array,
      required: false,
    },
    tags: {
      type: Array,
      required: false,
    },
  },
  mounted() {
    const rgb1 = this.rgb[0]; // get rgb data from props
    const rgb2 = this.rgb[1];
    const rgb3 = this.rgb[2];
    const rgb4 = this.rgb[3];
    const rgb5 = this.rgb[4];
    this.$refs.b1.style.background = `rgba(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]}, 1)`;
    this.$refs.b2.style.background = `rgba(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]}, 1)`;
    this.$refs.b3.style.background = `rgba(${rgb3[0]}, ${rgb3[1]}, ${rgb3[2]}, 1)`;
    this.$refs.b4.style.background = `rgba(${rgb4[0]}, ${rgb4[1]}, ${rgb4[2]}, 1)`;
    this.$refs.b5.style.background = `rgba(${rgb5[0]}, ${rgb5[1]}, ${rgb5[2]}, 1)`;
    // there is a better way to finish this part, but for now, just bear that~
  },
  data() {
    return {
      tagsShow: this.tags.join('  ·  '), // turn array into string
    };
  },
};
</script>

<style scoped>
.imgBoxContainer {
  position: relative;
  width: calc(100% / 6 - 10px);
}
.imgBoxContainer:hover .content {
  height: 90px;
}
.imgBox img {
  width: 100%;
}
.content {
  position: absolute;
  bottom: -36px;
  left: 0;
  width: 100%;
  height: 40px;
  margin: 0;
  background: white;
  overflow: hidden;
  transition: .5s all ease;
}
.content > div, .likes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .8rem;
  color: rgba(0, 0, 0, .9);
}
.upContent {
  height: 40px;
  padding: 0 10px;
  letter-spacing: .05rem;
}
.downContent {
  height: 39.5px;
  padding: 0 10px;
  border-top: solid .5px rgba(0, 0, 0, .3);
  letter-spacing: .05rem;
}
.likes {
  font-size: .7rem;
}
.likes img {
  width: 20px;
  height: 20px;
}
.colorBanner {
  display: flex;
  width: 100%;
  height: 10px;
}
.colorBlock {
  width: 20%;
  height: 100%;
  flex-direction: row;
}
</style>
