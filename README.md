# admin

## 直接赋值web项目在修改
### 1.去掉乘车人页面，修改登录后的进入页面。

## 2.修改登录的请求地址和登录的要求、生成station和admin的vue在加入router在修改。
* **router.js**
```js
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
        path: '/welcome',
        component:()=>import("@/views/main/welcome.vue"),
      },
      {
        path: '/station',
        component:()=>import("@/views/main/station.vue"),
      },
      {
        path: '/admin',
        component:()=>import("@/views/main/admin.vue"),
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
```
* **API.js**
```js
import {request} from "@/config/Axios";
//每一个请求都被封装为一个实例

export function getCode(mobile){
    //http://localhost:8090/api/
    return request({
        url: '/member/sendCode',
        method: 'POST',
        data: {
            mobile: mobile,
        }
    })
}

export function loginReq(mobile,password){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/login',
        method: 'POST',
        data: {
            mobile: mobile,
            password: password
        }
    })
}

// 发送保存的乘客的信息
export function saveStation(station){
    //http://localhost:8090/api/
    return request({
        url: '//business/admin/station/save',
        method: 'POST',
        data:{
            ...station
        }
    })
}

/**
 * 查询passengers
 * @param page 当前页
 * @param size 页面的大小
 */
export function getStations(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/station/query_list',
        method: 'GET',
        params:{
            page,
            size,
        },
    },{transformResponse: [
            function (data){
                return data;
            }
        ]})
}

/**
 * 删除管理员信息
 * @param record
 * @returns {*}
 */
export function deleteStation(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/station/delete/'+record.id,
        method: 'DELETE',
    })
}


/**
 * 保存、更新管理员信息
 * @param admin
 * @returns {*}
 */
export function saveAdmin(admin){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/save',
        method: 'POST',
        data:{
            ...admin
        }
    })
}

export function deleteAdmin(record){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/delete/'+record.id,
        method: 'DELETE',
    })
}

/**
 * 查询管理员
 * @param page
 * @param size
 * @returns {*}
 */
export function getAdmin(page,size){
    //http://localhost:8090/api/
    return request({
        url: '/business/admin/query_list',
        method: 'GET',
        params:{
            page,
            size,
        },
    },{transformResponse: [
            function (data){
                return data;
            }
        ]})
}
```
## 3.生成各个模快添加拼音转化功能
### 3.1 修改station模块的添加让拼音自动生成
插件 pinyin-pro的引用 [pinyin-pro官网](https://pinyin-pro.cn/use/pinyin.html)  
添加一个监视器来监听station.name的改变
```js
// 监听name来改变 pinyin
watch(()=> station.value.name,()=>{
    if (Tool.isNotEmpty(station.value.name)){
        station.value.namePinyin=pinyin(station.value.name,{toneType:'none'}).replaceAll(" ","")
        station.value.namePy=pinyin(station.value.name,{pattern:'first',toneType:'none'}).replaceAll(" ","")
    }else {
        station.value.namePy = ""
        station.value.namePinyin = ""
    }
},{immediate:true})
```

* 在为train_station和train一样添加这个拼音
