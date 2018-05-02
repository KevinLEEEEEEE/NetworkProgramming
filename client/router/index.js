import Vue from 'vue';
import Router from 'vue-router';
import download from '../pages/download';
import upload from '../pages/upload';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dpwnload',
      component: download,
    },
    {
      path: '/upload',
      name: 'upload',
      component: upload,
    },
  ],
});
