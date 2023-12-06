<template>
  <p>
    <a-space>
      <Train-select-view width="200px" v-model="params.code"></Train-select-view>
      <a-date-picker v-model:value="params.date"  valueFormat="YYYY-MM-DD" placeholder="请选择日期" width="200px" allow-clear/>
      <a-button type="primary" @click="handleQuery()">查找</a-button>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </a-space>
  </p>
  <a-table :dataSource="daily_trains"
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

      <template v-else-if="column.dataIndex === 'type'">
        <span v-for="item in TRAIN_TYPE_ARRAY" :key="item.key">
          <span v-if="item.key === record.type">
            {{item.value}}
          </span>
        </span>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="visible" title="每日车次" @ok="handleOk"
           ok-text="确认" cancel-text="取消">
    <a-form :model="daily_train" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="日期">
        <a-date-picker v-model:value="daily_train.date" valueFormat="YYYY-MM-DD" placeholder="请选择日期" />
      </a-form-item>
      <a-form-item label="车次编号">
        <Train-select-view  v-model="daily_train.code" @change="onChangeCode"></Train-select-view>
      </a-form-item>
      <a-form-item label="车次类型">
        <a-select v-model:value="daily_train.type">
          <a-select-option v-for="item in TRAIN_TYPE_ARRAY" :key="item.key" :value="item.key">
            {{item.key}}|{{item.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="始发站">
        <Station-select-view v-model="daily_train.start"></Station-select-view>
      </a-form-item>
      <a-form-item label="始发站拼音">
        <a-input v-model:value="daily_train.startPinyin"  disabled/>
      </a-form-item>
      <a-form-item label="出发时间">
        <a-time-picker v-model:value="daily_train.startTime" valueFormat="HH:mm:ss" placeholder="请选择时间" />
      </a-form-item>
      <a-form-item label="终点站">
        <Station-select-view v-model="daily_train.end"></Station-select-view>
      </a-form-item>
      <a-form-item label="终点站拼音">
        <a-input v-model:value="daily_train.endPinyin" disabled/>
      </a-form-item>
      <a-form-item label="到站时间">
        <a-time-picker v-model:value="daily_train.endTime" valueFormat="HH:mm:ss" placeholder="请选择时间" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {defineComponent, ref, onMounted, watch} from 'vue';
import {notification} from "ant-design-vue";
import {deleteDailyTrain, getDailyTrain, saveDailyTrain} from "@/API";
import TrainSelectView from "@/components/Train-select-view.vue";
import StationSelectView from "@/components/Station-select-view.vue";
import {pinyin} from "pinyin-pro";

export default defineComponent({
  name: "daily_train-view",
  components: {StationSelectView, TrainSelectView},
  setup() {
    const TRAIN_TYPE_ARRAY = window.TRAIN_TYPE_ARRAY;
    const visible = ref(false);
    let daily_train = ref({
      id: undefined,
      date: undefined,
      code: undefined,
      type: undefined,
      start: undefined,
      startPinyin: undefined,
      startTime: undefined,
      end: undefined,
      endPinyin: undefined,
      endTime: undefined,
      createTime: undefined,
      updateTime: undefined,
    });
    const params =ref({
      date: "",
      code:""
    })
    const daily_trains = ref([]);
    // 分页的三个属性名是固定的
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 10,
    });
    const onChangeCode = (train) => {
      console.log("车次下拉选择",train);
      // 用assign合并
      let t = Tool.copy(train);
      //删除ID属性
      delete t.id;
      daily_train.value =Object.assign(daily_train.value,t)
    }

    let loading = ref(false);
    const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '车次编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '车次类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '始发站',
      dataIndex: 'start',
      key: 'start',
    },
    {
      title: '始发站拼音',
      dataIndex: 'startPinyin',
      key: 'startPinyin',
    },
    {
      title: '出发时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '终点站',
      dataIndex: 'end',
      key: 'end',
    },
    {
      title: '终点站拼音',
      dataIndex: 'endPinyin',
      key: 'endPinyin',
    },
    {
      title: '到站时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '操作',
      dataIndex: 'operation'
    }
    ];

    //监听始发站
    watch(()=>daily_train.value.start,()=>{
      if (Tool.isNotEmpty(daily_train.value.start)){
        daily_train.value.startPinyin= pinyin(daily_train.value.start,{ toneType: 'none' }).replaceAll(" ","")
      }else {
        daily_train.value.startPinyin=""
      }
    },{immediate:true})
    //监听终点站
    watch(()=>daily_train.value.end,()=>{
      if (Tool.isNotEmpty(daily_train.value.end)){
        daily_train.value.endPinyin= pinyin(daily_train.value.end,{ toneType: 'none' }).replaceAll(" ","")
      }else {
        daily_train.value.endPinyin=""
      }
    },{immediate:true})

    const onAdd = () => {
      daily_train.value = {};
      visible.value = true;
    };

    const onEdit = (record) => {
      daily_train.value = window.Tool.copy(record);
      visible.value = true;
    };

    const onDelete = (record) => {
      deleteDailyTrain(record).then((response) => {
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
      saveDailyTrain(daily_train.value).then((response) => {
        if (response.code===200) {
          notification.success({description: response.message});
          visible.value = false;
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
      getDailyTrain(param.page,param.size,params.value).then((response) => {
        loading.value = false;
        if (response.code===200) {
          daily_trains.value = response.data.records;
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

    return {
      TRAIN_TYPE_ARRAY,
      daily_train,
      visible,
      daily_trains,
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
      onChangeCode
    };
  },
});
</script>
