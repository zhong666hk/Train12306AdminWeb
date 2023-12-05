import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";
import {notification} from "ant-design-vue";

const routes = [
  // {
  //   path: '/',
  //   name: 'login',
  //   component: Login
  // },
  //   懒加载的方式
  {
    path: '/login',
    name: 'login',
    component:()=>import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'main',
    component:()=>import('@/views/Main.vue'),
    meta: {
      loginRequire: true
    },
    children: [
      {
        path: 'welcome',
        component:()=>import("@/views/main/welcome.vue"),
      },
      {
        path: 'base',
        children: [
          {
            path: 'station',
            component:()=>import("@/views/main/business/station.vue"),
          },
          {
            path: 'admin',
            component:()=>import("@/views/main/business/admin.vue"),
          },
          {
            path: 'train',
            component:()=>import("@/views/main/business/train.vue"),
          },
          {
            path: 'train_station',
            component:()=>import("@/views/main/business/train_station.vue"),
          },
          {
            path: 'train_carriage',
            component:()=>import("@/views/main/business/train_carriage.vue"),
          },
          {
            path: 'train_seat',
            component:()=>import("@/views/main/business/train_seat.vue"),
          },
        ]
      },
      {
        path: 'batch',
        children: [
          {
            path: 'job',
            component:()=>import("@/views/main/batch/job.vue"),
          },
        ]
      },

    ]
  },
  {
    path: '',
    redirect: '/welcome'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 路由登录拦截
router.beforeEach((to, from, next) => {
  // 要不要对meta.loginRequire属性做监控拦截
  if (to.matched.some(function (item) {
    console.log(item, "是否需要登录校验：", item.meta.loginRequire || false);
    return item.meta.loginRequire
  })) {
    const _member = store.state.member;
    console.log("页面登录校验开始：", _member);
    if (!_member.token) {
      console.log("用户未登录或登录超时！");
      notification.error({ description: "未登录或登录超时" });
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
