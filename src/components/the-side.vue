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
      openKeys : ref(['/welcome','batch','base']),
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

      <a-sub-menu key="business">
        <template #title>
          <span>
            <UnorderedListOutlined />业务管理
          </span>
        </template>
        <a-menu-item key="/business/daily-train">
          <router-link to="/business/daily-train">
            <FieldTimeOutlined />&nbsp;今日车次
          </router-link>
        </a-menu-item>

        <a-menu-item key="/business/daily-train-station">
          <router-link to="/business/daily-train-station">
            <FieldTimeOutlined />&nbsp;今日车站
          </router-link>
        </a-menu-item>

      </a-sub-menu>

      <a-sub-menu key="base">
        <template #title>
          <span>
            <HolderOutlined />基础数据
          </span>
        </template>
        <a-menu-item key="/base/station">
          <router-link to="/base/station">
            <UserOutlined />&nbsp;车站管理
          </router-link>
        </a-menu-item>
        <a-menu-item key="/base/admin">
          <router-link to="/base/admin">
            <UserOutlined />&nbsp;管理员
          </router-link>
        </a-menu-item>
        <a-menu-item key="/base/train">
          <router-link to="/base/train">
            <UserOutlined />&nbsp;火车管理
          </router-link>
        </a-menu-item>

        <a-menu-item key="/base/train_station">
          <router-link to="/base/train_station">
            <UserOutlined />&nbsp;火车车站管理
          </router-link>
        </a-menu-item>

        <a-menu-item key="/base/train_carriage">
          <router-link to="/base/train_carriage">
            <UserOutlined />&nbsp;火车车厢管理
          </router-link>
        </a-menu-item>

        <a-menu-item key="/base/train_seat">
          <router-link to="/base/train_seat">
            <UserOutlined />&nbsp;火车座位管理
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="batch">
        <template #title>
          <span>
            <UnorderedListOutlined />跑批管理
          </span>
        </template>
        <a-menu-item key="/batch/job">
          <router-link to="/batch/job">
            <FieldTimeOutlined />&nbsp;定时任务
          </router-link>
        </a-menu-item>
      </a-sub-menu>


    </a-menu>
  </a-layout-sider>
</template>

<style scoped>

</style>
