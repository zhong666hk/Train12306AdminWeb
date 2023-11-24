<template>
  <div class="container" >
    <a-row>
      <a-col :span="8" :offset="8" class="loginMain">
        <h1 style="text-align: center">&nbsp;仔仔棒12306售票系统</h1>
        <a-form
            :model="loginForm"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 12 }"
            autocomplete="off"
            @validate="handleValidate"
        >
          <a-form-item
              label="Mobile"
              name="mobile"
              :rules="[{ required: true, message: '请输入在正确手机号!' ,pattern:/(^\d{11}$)/}]"
          >
            <a-input v-model:value="loginForm.mobile" placeholder="手机号"/>
          </a-form-item>
          <a-form-item
              label="Password"
              name="password"
              :rules="[{ required: true, message: '请输入符合条件的密码!', pattern:/^[a-zA-Z]\w{6,15}$/,trigger: 'blur'}]"
          >
            <a-input v-model:value="loginForm.password" placeholder="密码"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 6, span: 12 }">
            <a-button v-model:disabled="isUsable" @click="login" type="primary"  html-type="submit" style="width: 100%">登录</a-button>
          </a-form-item>
        </a-form>
      </a-col>

    </a-row>
  </div>

</template>
<script>
import {defineComponent, reactive, ref} from 'vue';
import { loginReq} from "@/API";
import {notification} from "ant-design-vue";
/**
 * useRouter --全局路由的管理--》路由的管理者
 * useRoute --当前路由  -->获取当前路由的信息
 */
import {useRouter} from "vue-router";
import store from "@/store";
export default defineComponent({
  name: "login-view",
  setup() {
    const router=useRouter()

    const loginForm = reactive({
      mobile: '16607211504',
      password: '',
    });


    const login = () => {
      loginReq(loginForm.mobile,loginForm.password).then(res=>{
        console.log(res)
        if (res.code === 200){
          notification.success({description:res.message})
          store.commit("setMember",{token:res.data.token,mobile:loginForm.mobile})
          router.push('/welcome')
        }else {
          notification.error({description:res.message})
        }
      }).catch(err=>{
        console.log(err)
      })
    };
    /**
     * 每次 校验都会触发一次
     * @param name
     * @param status
     * @param errorMsgs
     */
    const handleValidate = (name,status,errorMsgs) => {
      console.log(name,status,errorMsgs)
      if (status){
        isUsable.value=false;
      }else {
        isUsable.value=true;
      }
    };

    const isUsable=ref(false);

    return {
      loginForm,
      login,
      isUsable,
      handleValidate
    };
  },
});
</script>
<style scoped>
 .loginMain{
   margin-top: 10%;
   background: linear-gradient(to right, rgb(140, 203, 233) 10%, rgba(27, 201, 201, 0.8) 40%, rgba(26, 154, 224, 0.1) 70%);
   opacity: 0.7;
 }
</style>
