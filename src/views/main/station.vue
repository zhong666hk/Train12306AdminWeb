
<template>
  <div>
<!--    添加的模态框-->
    <div>
      <button @click="onAdd">新增</button>
      <a-modal v-model:open="open" title="新增站台" @ok="handleOk" cancelText="取消" okText="确定">
        <a-form
            ref="formRef"
            :model="station"
            :rules="rules"
            :label-col="{span: 4}"
            :wrapper-col="{span: 18}"
        >
          <a-form-item ref="name" label="站台名字" name="name">
            <a-input v-model:value="station.name" />
          </a-form-item>
          <a-form-item ref="namePinyin" label="拼音" name="namePinyin">
            <a-input v-model:value="station.namePinyin" />
          </a-form-item>
          <a-form-item ref="namePy" label="拼音首字母" name="namePy">
            <a-input v-model:value="station.namePy" />
          </a-form-item>
        </a-form>

      </a-modal>
    </div>
<!--    展示的表格-->
    <a-table :dataSource="stations" :columns="columns" :pagination="pagination" @change="handleTableChange">
<!--      插入节点-->
      <template #bodyCell="{column,record}">
        <template v-if="column.dataIndex==='operation'">
          <a-space>
            <a-popconfirm
                title="删除后不可恢复,你确定要删除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="onDelete(record)"
            >
              <a href="#" style="color: red">删除</a>
            </a-popconfirm>
            <a @click="onEdit(record)">编辑</a>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script>
import {defineComponent, ref} from 'vue';
import {deleteStation, getStations, saveStation} from "@/API";
import {notification} from "ant-design-vue";

export default defineComponent({
  name: "the-station",
  setup() {
    const open = ref(false);
    const rules = {
      name: [
        {
          required: true,
          trigger: 'blur',
          message: '请输入站台名'
        },
        {
          min:3,
          max:8,
          message: '请输入正确的站台名',
          trigger: 'change',
        },
      ],
      namePinyin:[
        {
          required: true,
          message: '请输入站台拼音',
          trigger: 'blur',
          min:3
        }
      ],
      namePy:[
        {
          required: true,
          message: '请输入站台拼音首字母',
          trigger: 'blur',
          min:2
        }
      ]
    };
    const station = ref({
      id:undefined,
      name: '',
      namePinyin:'',
      namePy:'',
      createTime:undefined,
      updateTime:undefined,
    });
    const onAdd = () => {
      // 清空表单
      station.value={
        id:undefined,
        name: '',
        namePinyin:'',
        namePy:'',
        createTime:undefined,
        updateTime:undefined,
      };
      open.value = true;
    };
    const handleOk = () => {
      saveStation(station.value).then(res=>{
        if (res.data){
          notification.success({description:res.message})
          // 清除本地数据
          station.value.type=undefined;
          station.value.name=''
          station.value.namePinyin=''
          open.value = false;
          // 刷新列表
          getStations(pagination.value.current,pagination.value.pageSize).then((res)=>{
            if (res.code===200){
              // 设置分页控件值
              stations.value=res.data.records
              pagination.value.total=res.data.total
            }
            else {
              notification.error({description:'刷新列表失败'})
            }
          })
        }else{
          notification.error({description:'新增站台异常'})
        }
      })
    };
    let stations=ref([]);
    // 分页的参数
    let pagination=ref({
      total:0,
      current:1,
      pageSize:3,
    });
    const pageQuery=(page,size)=>{
      getStations(page,size).then((res)=>{
        if (res.code===200){
          // 设置分页控件值
          pagination.value.current=page
          stations.value=res.data.records
          pagination.value.total=res.data.total
          pagination.value.pageSize=size
        }
        else {
          notification.error({description:'查询失败'})
        }
      })
    }
    const handleTableChange=(pagination)=>{
      pageQuery(pagination.current,pagination.pageSize)
    }
    const onEdit=(record)=>{
      // 给模态窗口赋值-->防止双向的绑定--->用拷贝的方式
      station.value=window.Tool.copy(record);
      open.value=true;
    }
    const onDelete=(record)=>{
      deleteStation(record).then(res=>{
        if (res.data){
          notification.success({description:res.message})
          // 刷新列表
          getStations(pagination.value.current,pagination.value.pageSize).then((res)=>{
            if (res.code===200){
              // 设置分页控件值
              stations.value=res.data.records
              pagination.value.total=res.data.total
            }
            else {
              notification.error({description:'刷新列表失败'})
            }
          })
        }else {
          notification.error({description:'删除失败'})
        }
      })
    }
    // 票类型枚举-->通过windows去读取
    const PASSENGER_TYPE_ARRAY=window.PASSENGER_TYPE_ARRAY
    return {
      onAdd,
      handleOk,
      open,
      station,
      rules,
      stations,
      pagination,
      handleTableChange,
      onEdit,
      onDelete,
      PASSENGER_TYPE_ARRAY,
      columns: [
        {
          title: '站台名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '站台拼音',
          dataIndex: 'namePinyin',
          key: 'namePinyin',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
        },
      ],
    };
  },
  mounted() {
      getStations(1,3).then((res)=>{
        if (res.code===200){
          this.stations=res.data.records
          // 设置分页控件值
          this.pagination.current=res.data.current
          this.pagination.total=res.data.total
          this.pagination.pageSize=res.data.size
        }
        else {
          notification.error({description:'查询失败'})
        }
      })
  }
})

</script>

<style scoped>

</style>
