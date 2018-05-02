<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/">Download</router-link></li>
        <li><router-link to="/upload">Upload</router-link></li>
      </ul>
    </nav>
    <div id="main">
      <div>
        <div id="search" class="box">
          <input type="text"
          v-model="searchInput" @keydown.enter="search"
          :class="[isActive ? 'active' : 'hide', 'ease']">
          <div class="btns" :style="searchBtn" @click="search"></div>
        </div>
      </div>
      <div id="upload" class="box">
        <input type="text"
        :class="[isActive ? 'hide' : 'active', 'ease']">
        <div class="btns" :style="uploadBtn" @click="upload"></div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import searchBtn from '../static/searchBtn.png';
import uploadBtn from '../static/uploadBtn.png';
import addBtn from '../static/addBtn.png';

export default {
  name: 'App',
  data() {
    return {
      searchBtn: {
        backgroundImage: `url(${searchBtn})`,
      },
      uploadBtn: {
        backgroundImage: `url(${uploadBtn})`,
      },
      addBtn: {
        backgroundImage: `url(${addBtn})`,
      },
      isActive: true,
      searchInput: '',
    }; // major background data, $refs might be a better choice
  },
  methods: {
    upload() {
      if (this.isActive) {
        this.isActive = false;
      }
    },
    search() {
      if (!this.isActive) {
        this.isActive = true;
        return;
      }
      if (!this.searchInput) {
        return;
      }
      this.searchInput = ''; // clear data after search
    },
  },
};
</script>

<style scoped>
nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, .1);
}
nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
nav li {
  width: 120px;
  height: 60px;
}
#main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: 2000px;
  height: 900px;
  background-color: lightblue;
}
#main > div {
  margin: 5px;
}
input {
  height: 50px;
  box-sizing: border-box;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  text-indent: 20px;
}
.box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: rgba(0, 0, 0, .4);
  border: 1.5px solid white;
  border-radius: 50px;
}
.btns {
  width: 50px;
  height: 50px;
  border-radius: 0 50px 50px 0;
  background: center no-repeat;
  background-size: 70%;
}
.ease {
  transition: all .5s ease;
}
.active {
  width: 350px;
}
.hide {
  width: 0;
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, .6);
  font-size: 0.85rem;
  text-decoration: none;
}
a:hover {
  color: rgba(255, 255, 255, 1.0);
}
</style>
