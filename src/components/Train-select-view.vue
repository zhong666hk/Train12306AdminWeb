<template>
  <a-select
      v-model:value="trainCode"
      style="width: 100%"
      placeholder="请选择车次编号"
      show-search
      :filter-option="filterTrainCodeOption"
      @change="onChange"
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
  props:["modelValue"], // 父组件的值
  emits:['update:modelValue','change'],
  setup(props,{emit}){
    const trainCode =ref();
    const trains=ref([]);
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
      // 扩展
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
      trains
    }
  }
})

</script>

<style scoped>

</style>
