<template>
  <p>
    <a-space>
      <Train-select-view width="200px" v-model="params.trainCode"></Train-select-view>
      <a-date-picker v-model:value="params.date"  valueFormat="YYYY-MM-DD" placeholder="请选择日期" width="200px" allow-clear/>
      <a-button type="primary" @click="handleQuery()">查找</a-button>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </a-space>
  </p>
  <a-table :dataSource="daily_train_carriages"
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
      <template v-else-if="column.dataIndex === 'seatType'">
        <span v-for="item in SEAT_TYPE_ARRAY" :key="item.key">
          <span v-if="item.key === record.seatType">
            {{item.value}}
          </span>
        </span>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="visible" title="每日车厢" @ok="handleOk"
           ok-text="确认" cancel-text="取消">
    <a-form :model="daily_train_carriage" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="日期">
        <a-date-picker v-model:value="daily_train_carriage.date" valueFormat="YYYY-MM-DD" placeholder="请选择日期" />
      </a-form-item>
      <a-form-item label="车次编号">
        <Train-select-view v-model="daily_train_carriage.trainCode"></Train-select-view>
      </a-form-item>
      <a-form-item label="箱序">
        <a-input v-model:value="daily_train_carriage.index" />
      </a-form-item>
      <a-form-item label="座位类型">
        <a-select v-model:value="daily_train_carriage.seatType">
          <a-select-option v-for="item in SEAT_TYPE_ARRAY" :key="item.key" :value="item.key">
            {{item.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
<!--      <a-form-item label="座位数">-->
<!--        <a-input v-model:value="daily_train_carriage.seatCount" />-->
<!--      </a-form-item>-->
      <a-form-item label="排数">
        <a-input v-model:value="daily_train_carriage.rowCount" />
      </a-form-item>
<!--      <a-form-item label="列数">-->
<!--        <a-input v-model:value="daily_train_carriage.colCount" />-->
<!--      </a-form-item>-->
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import {notification} from "ant-design-vue";
import TrainSelectView from "@/components/Train-select-view.vue";
import {deleteDailyTrainStationCarriage, getDailyTrainStationCarriage, saveDailyTrainStationCarriage} from "@/API";

export default defineComponent({
  name: "daily_train_carriage-view",
  components: {TrainSelectView},
  setup() {
    const SEAT_TYPE_ARRAY = window.SEAT_TYPE_ARRAY;
    const visible = ref(false);
    let daily_train_carriage = ref({
      id: undefined,
      date: undefined,
      trainCode: undefined,
      index: undefined,
      seatType: undefined,
      seatCount: undefined,
      rowCount: undefined,
      colCount: undefined,
      createTime: undefined,
      updateTime: undefined,
    });
    const daily_train_carriages = ref([]);
    // 分页的三个属性名是固定的
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 10,
    });
    let loading = ref(false);
    const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '车次编号',
      dataIndex: 'trainCode',
      key: 'trainCode',
    },
    {
      title: '箱序',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '座位类型',
      dataIndex: 'seatType',
      key: 'seatType',
    },
    {
      title: '座位数',
      dataIndex: 'seatCount',
      key: 'seatCount',
    },
    {
      title: '排数',
      dataIndex: 'rowCount',
      key: 'rowCount',
    },
    {
      title: '列数',
      dataIndex: 'colCount',
      key: 'colCount',
    },
    {
      title: '操作',
      dataIndex: 'operation'
    }
    ];

    const params=ref({
      trainCode:'',
      date:''
    })
    const onAdd = () => {
      daily_train_carriage.value = {};
      visible.value = true;
    };

    const onEdit = (record) => {
      daily_train_carriage.value = window.Tool.copy(record);
      visible.value = true;
    };

    const onDelete = (record) => {
      deleteDailyTrainStationCarriage(record).then((response) => {
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
      saveDailyTrainStationCarriage(daily_train_carriage.value).then((response) => {
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
      getDailyTrainStationCarriage(param.page,param.size,params.value).then((response) => {
        loading.value = false;
        if (response.code===200) {
          daily_train_carriages.value = response.data.records;
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
      SEAT_TYPE_ARRAY,
      daily_train_carriage,
      visible,
      daily_train_carriages,
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
    };
  },
});
</script>
