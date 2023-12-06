<template>
  <a-select
      v-model:value="trainCode"
      :style="'width:'+ myWidth"
      placeholder="请选择车次编号"
      show-search
      :filter-option="filterTrainCodeOption"
      @change="onChange"
      allow-clear
  >
    <a-select-option v-for="item in trains" :key="item.code"
                     :value="item.code" :label="item.code+item.start+item.end">
      {{item.code}}|{{item.start}}~{{item.end}}
    </a-select-option>
  </a-select>
</template>

<script>
import {defineComponent, onMounted, ref, watch} from "vue";
import {queryAllTrain} from "@/API";
import {notification} from "ant-design-vue";

export default defineComponent({
  name:"train-select-view",
  props:["modelValue","width"], // 父子组件的变量
  emits:['update:modelValue','change'], // 子父组件的方法定义
  setup(props,{emit}){
    const trainCode =ref();
    const trains=ref([]);
    const myWidth=ref(props.width)
    if (Tool.isEmpty(props.width)){
      myWidth.value="100%"
    }


    /**
     * 过滤函数
     * @param input 输入框的值
     * @param option 选择栏在数据
     * @returns {boolean}
     */
    const filterTrainCodeOption = (input,option) => {
      console.log(input,option)
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    // 查询车站编号
    const queryTrainCode =()=>{
      queryAllTrain().then((response)=>{
        if (response.code===200){
          console.log("查询车站code")
          console.log(response)
          trains.value=response.data
        }else {
          notification.error({description:response.message})
        }
      })
    }
    // 利用watch()动态获取父组件的值 父传子 当父选择后
    watch(()=>props.modelValue,()=>{
      console.log("props.modelValue",props.modelValue);
      // 更新子组件的值
      trainCode.value=props.modelValue
    },{immediate:true})

    // 子组件传值给父组件
    const onChange=(value)=>{
      // 通知更新父组件的值
      emit('update:modelValue',value);
      // 扩展 --->将整条数据都返回出去train参数  change方法也暴露了。父组件用不用是它的事
      // 父组件就可以用 @change="父组件的方法" (train)=>{}
      let train =trains.value.filter(item=>item.code===value)[0];
      if (Tool.isNotEmpty(train)){
        train={};
      }
      emit('change',train);
    }
    onMounted(()=>{
      queryTrainCode();
    })

    return{
      trainCode,
      filterTrainCodeOption,
      queryTrainCode,
      onChange,
      trains,
      myWidth,
    }
  }
})

</script>

<style scoped>

</style>
