<script>
import {defineComponent, ref, watch} from "vue";
import router from "@/router";
export default defineComponent({
  name: "the-side-view",
  setup() {
    const selectedKeys2=ref([])
    watch(()=>router.currentRoute.value.path,(newValue)=>{
      console.log('watch',newValue);
      selectedKeys2.value=[];
      selectedKeys2.value.push(newValue);
    },{immediate:true})
    return {
      selectedKeys2 ,
      openKeys : ref(['/welcome']),
    };
  },
})
</script>
<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
        v-model:selectedKeys="selectedKeys2"
        v-model:openKeys="openKeys"
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
    >

      <a-menu-item key="/welcome">
        <router-link to="/welcome">
          <HomeOutlined />&nbsp;欢迎
        </router-link>
      </a-menu-item>
      <a-menu-item key="/station">
        <router-link to="/station">
          <UserOutlined />&nbsp;车站管理
        </router-link>
      </a-menu-item>
      <a-menu-item key="/admin">
        <router-link to="/admin">
          <UserOutlined />&nbsp;管理员
        </router-link>
      </a-menu-item>
      <a-menu-item key="/train">
        <router-link to="/train">
          <UserOutlined />&nbsp;火车管理
        </router-link>
      </a-menu-item>

      <a-menu-item key="/train_station">
        <router-link to="/train_station">
          <UserOutlined />&nbsp;火车车站管理
        </router-link>
      </a-menu-item>

      <a-menu-item key="/train_carriage">
        <router-link to="/train_carriage">
          <UserOutlined />&nbsp;火车车厢管理
        </router-link>
      </a-menu-item>

      <a-menu-item key="/train_seat">
        <router-link to="/train_seat">
          <UserOutlined />&nbsp;火车座位管理
        </router-link>
      </a-menu-item>

    </a-menu>
  </a-layout-sider>
</template>

<style scoped>

</style>
