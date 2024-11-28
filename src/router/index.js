import { createRouter, createWebHistory } from 'vue-router';
import QueryPage from '../views/QueryPage.vue'; // 引入 QueryPage 组件

const routes = [
  {
    path: '/query',
    name: 'QueryPage',
    component: QueryPage // 使用 QueryPage 作为查询页面
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
