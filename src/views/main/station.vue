<template>
  <p>
    <a-space>
      <a-button type="primary" @click="handleQuery()">刷新</a-button>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </a-space>
  </p>
  <a-table :dataSource="stations"
           :columns="columns"
           :pagination="pagination"
           @change="handleTableChange"
           :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'">
        <a-space>
          <a-popconfirm
              title="删除后不可恢复，确认删除?"
              @confirm="onDelete(record)"
              ok-text="确认" cancel-text="取消">
            <a style="color: red">删除</a>
          </a-popconfirm>
          <a @click="onEdit(record)">编辑</a>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="open" title="车站" @ok="handleOk"
           ok-text="确认" cancel-text="取消">
    <a-form :model="station" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="站名">
        <a-input v-model:value="station.name" />
      </a-form-item>
      <a-form-item label="站名拼音">
        <a-input v-model:value="station.namePinyin" disabled/>
      </a-form-item>
      <a-form-item label="站名拼音首字母">
        <a-input v-model:value="station.namePy" disabled />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {defineComponent, ref, onMounted, watch} from 'vue';
import {notification} from "ant-design-vue";
import {deleteStation, getStations, saveStation} from "@/API";
import {pinyin} from "pinyin-pro";

export default defineComponent({
  name: "station-view",
  setup() {
    const open = ref(false);
    let station = ref({
      id: undefined,
      name: undefined,
      namePinyin: undefined,
      namePy: undefined,
      createTime: undefined,
      updateTime: undefined,
    });
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
    const stations = ref([]);
    // 分页的三个属性名是固定的
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 10,
    });
    let loading = ref(false);
    const columns = [
    {
      title: '站名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '站名拼音',
      dataIndex: 'namePinyin',
      key: 'namePinyin',
    },
    {
      title: '站名拼音首字母',
      dataIndex: 'namePy',
      key: 'namePy',
    },
    {
      title: '操作',
      dataIndex: 'operation'
    }
    ];

    const onAdd = () => {
      station.value = {};
      open.value = true;
    };

    const onEdit = (record) => {
      station.value = window.Tool.copy(record);
      open.value = true;
    };

    const onDelete = (record) => {
      deleteStation(record).then((response) => {
        console.log(response)
        if (response.code===200) {
          notification.success({description: "删除成功！"});
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
        } else {
          notification.error({description: response.message});
        }
      });
    };

    const handleOk = () => {
      saveStation(station.value).then((response) => {
        console.log(response)
        if (response.code===200) {
          notification.success({description: response.message});
          open.value = false;
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize
          });
        } else {
          notification.error({description: response.message});
        }
      });
    };

    const handleQuery = (param) => {
      if (!param) {
        param = {
          page: 1,
          size: pagination.value.pageSize
        };
      }
      loading.value = true;
      getStations(param.page,param.size).then((response) => {
        loading.value = false;
        if (response.code===200) {
          stations.value = response.data.records;
          // 设置分页控件的值
          pagination.value.current = param.page;
          pagination.value.total = response.total;
        } else {
          notification.error({description: response.message});
        }
      });
    };

    const handleTableChange = (page) => {
      // console.log("看看自带的分页参数都有啥：" + JSON.stringify(page));
      pagination.value.pageSize = page.pageSize;
      handleQuery({
        page: page.current,
        size: page.pageSize
      });
    };

    onMounted(() => {
      handleQuery({
        page: 1,
        size: pagination.value.pageSize
      });
    });

    return {
      station,
      open,
      stations,
      pagination,
      columns,
      handleTableChange,
      handleQuery,
      loading,
      onAdd,
      handleOk,
      onEdit,
      onDelete
    };
  },
});
</script>
