<template>
  <p>
    <a-space>
      <Train-select-view width="200px" v-model="params.trainCode"></Train-select-view>
      <a-button type="primary" @click="handleQuery()">查找</a-button>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </a-space>
  </p>
  <a-table :dataSource="train_stations"
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
  <a-modal v-model:open="open" title="火车车站" @ok="handleOk"
           ok-text="确认" cancel-text="取消">
    <a-form :model="train_station" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="车次编号">
<!--        抽取成一个组件-->
        <Train-select-view v-model="train_station.trainCode"></Train-select-view>
      </a-form-item>
      <a-form-item label="站序">
        <a-input v-model:value="train_station.index" />
      </a-form-item>
      <a-form-item label="站名">
        <!--        抽取成一个组件-->
        <Station-select-view v-model="train_station.name"></Station-select-view>
      </a-form-item>
      <a-form-item label="站名拼音">
        <a-input v-model:value="train_station.namePinyin" disabled />
      </a-form-item>
      <a-form-item label="进站时间">
        <a-time-picker v-model:value="train_station.inTime" valueFormat="HH:mm:ss" placeholder="请选择时间" />
      </a-form-item>
      <a-form-item
          label="出站时间"
          name="outTime"
          :rules="[{ required: true, message: '请输入正确的结束时间',trigger:'blur'},{validator:validOutTime}]"
      >
        <a-time-picker v-model:value="train_station.outTime" valueFormat="HH:mm:ss" placeholder="请选择时间" />
      </a-form-item>
      <a-form-item label="停站时长">
        <a-time-picker v-model:value="train_station.stopTime" valueFormat="HH:mm:ss" placeholder="请选择时间" disabled />
      </a-form-item>
      <a-form-item label="里程（公里）">
        <a-input v-model:value="train_station.km" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {defineComponent, ref, onMounted, watch} from 'vue';
import {notification} from "ant-design-vue";
import {deleteTrainStation, getTrainStation, saveTrainStation} from "@/API";
import {pinyin} from "pinyin-pro";
import TrainSelectView from "@/components/Train-select-view.vue";
import StationSelectView from "@/components/Station-select-view.vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "train_station-view",
  components: {StationSelectView, TrainSelectView},
  setup() {
    const open = ref(false);
    let train_station = ref({
      id: undefined,
      trainCode: undefined,
      index: undefined,
      name: undefined,
      namePinyin: undefined,
      inTime: undefined,
      outTime: undefined,
      stopTime: undefined,
      km: undefined,
      createTime: undefined,
      updateTime: undefined,
    });

    //监听name
    watch(()=>train_station.value.name,()=>{
      if (Tool.isNotEmpty(train_station.value.name)){
        train_station.value.namePinyin= pinyin(train_station.value.name,{ toneType: 'none' }).replaceAll(" ","")
      }else {
        train_station.value.namePinyin=""
      }
    },{immediate:true})


    // 监听入站时长和出站时间 -->计算靠站时长
    watch(()=>train_station.value.inTime,()=>{
      // 出站 - 进站 化为秒
      let diff = dayjs(train_station.value.outTime,'HH:mm:ss')
          .diff(dayjs(train_station.value.inTime,'HH:mm:ss'),'seconds');
      train_station.value.stopTime= dayjs ('00:00:00','HH:mm:ss').second(diff).format('HH:mm:ss');
    },{immediate:true})
    watch(()=>train_station.value.outTime,()=>{
      // 出站 - 进站 化为秒
      let diff = dayjs(train_station.value.outTime,'HH:mm:ss')
          .diff(dayjs(train_station.value.inTime,'HH:mm:ss'),'seconds');
      train_station.value.stopTime= dayjs ('00:00:00','HH:mm:ss').second(diff).format('HH:mm:ss');
    },{immediate:true})

    const train_stations = ref([]);
    // 分页的三个属性名是固定的
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 10,
    });
    let loading = ref(false);
    const columns = [
    {
      title: '车次编号',
      dataIndex: 'trainCode',
      key: 'trainCode',
    },
    {
      title: '站序',
      dataIndex: 'index',
      key: 'index',
    },
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
      title: '进站时间',
      dataIndex: 'inTime',
      key: 'inTime',
    },
    {
      title: '出站时间',
      dataIndex: 'outTime',
      key: 'outTime',
    },
    {
      title: '停站时长',
      dataIndex: 'stopTime',
      key: 'stopTime',
    },
    {
      title: '里程（公里）',
      dataIndex: 'km',
      key: 'km',
    },
    {
      title: '操作',
      dataIndex: 'operation'
    }
    ];

    const onAdd = () => {
      train_station.value = {};
      open.value = true;
    };

    const onEdit = (record) => {
      train_station.value = window.Tool.copy(record);
      open.value = true;
    };

    const onDelete = (record) => {
      deleteTrainStation(record).then((response) => {
        if (response.code===200) {
          notification.success({description: response.message});
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
      saveTrainStation(train_station.value).then((response) => {
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
      getTrainStation(param.page,param.size,params.value).then((response) => {
        loading.value = false;
        if (response.code===200) {
          train_stations.value = response.data.records;
          // 设置分页控件的值
          pagination.value.current = param.page;
          pagination.value.total = response.data.total;
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

    // 查询条件
    const params=ref({
      trainCode:null,
    })

    // 框架校验是异步的 promise
    const validOutTime=async (value)=>{
      if (!!value && value > train_station.value.inTime){
        await Promise.resolve()
      }
      await Promise.reject('出站时间非法')
    }


    return {
      train_station,
      open,
      train_stations,
      pagination,
      columns,
      handleTableChange,
      handleQuery,
      loading,
      onAdd,
      handleOk,
      onEdit,
      onDelete,
      params,
      validOutTime,
    };
  },
});
</script>
