import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import "ant-design-vue/dist/reset.css"
import * as Icons from '@ant-design/icons-vue'
import  '@/assets/js/TRAIN_TYPE_ARRAY'
import '@/assets/js/SEAT_TYPE_ARRAY'
import '@/assets/js/SEAT_COL_ARRAY'

const app = createApp(App)
app.use(store).use(router).use(Antd)
app.mount('#app')
const icons = Icons
for (const i in icons) {
    app.component(i, icons[i])
}
