<template>
  <p>
    <a-space>
      <Train-select-view v-model="params.trainCode" width="200px"></Train-select-view>
      <a-date-picker v-model:value="params.date"  valueFormat="YYYY-MM-DD" placeholder="请选择日期" width="200px" allow-clear/>
      <a-button type="primary" @click="handleQuery()">查找</a-button>
    </a-space>
  </p>
  <a-table :dataSource="daily_train_seats"
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
      <template v-if="column.dataIndex === 'col'">
        <span v-for="item in SEAT_COL_ARRAY" :key="item.key">
          <span v-if="item.key === record.col && item.type=== record.seatType">
            {{item.value}}
          </span>
        </span>
      </template>
      <template v-else-if="column.dataIndex === 'seatType'">
        <span v-for="item in SEAT_TYPE_ARRAY" :key="item.key">
          <span v-if="item.key === record.seatType " >
            {{item.value}}
          </span>
        </span>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="visible" title="每日座位" @ok="handleOk"
           ok-text="确认" cancel-text="取消">
    <a-form :model="daily_train_seat" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="日期">
        <a-date-picker v-model:value="daily_train_seat.date" valueFormat="YYYY-MM-DD" placeholder="请选择日期" />
      </a-form-item>
      <a-form-item label="车次编号">
        <Train-select-view v-model="daily_train_seat.trainCode" width="200px"></Train-select-view>
      </a-form-item>
      <a-form-item label="箱序">
        <a-input v-model:value="daily_train_seat.carriageIndex" />
      </a-form-item>
      <a-form-item label="排号">
        <a-input v-model:value="daily_train_seat.row" />
      </a-form-item>
      <a-form-item label="列号">
        <a-select v-model:value="daily_train_seat.col">
          <a-select-option v-for="item in SEAT_COL_ARRAY" :key="item.key" :value="item.key">
            {{item.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="座位类型">
        <a-select v-model:value="daily_train_seat.seatType">
          <a-select-option v-for="item in SEAT_TYPE_ARRAY" :key="item.key" :value="item.key">
            {{item.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="同车箱座序">
        <a-input v-model:value="daily_train_seat.carriageSeatIndex" />
      </a-form-item>
      <a-form-item label="售卖情况">
        <a-input v-model:value="daily_train_seat.sell" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import {notification} from "ant-design-vue";
import {deleteDailyTrainStationSeat, getDailyTrainStationSeat, saveDailyTrainStationSeat} from "@/API";
import TrainSelectView from "@/components/Train-select-view.vue";

export default defineComponent({
  name: "daily_train_seat-view",
  components: {TrainSelectView},
  setup() {
    const SEAT_COL_ARRAY = window.SEAT_COL_ARRAY;
    const SEAT_TYPE_ARRAY = window.SEAT_TYPE_ARRAY;
    const visible = ref(false);
    let daily_train_seat = ref({
      id: undefined,
      date: undefined,
      trainCode: undefined,
      carriageIndex: undefined,
      row: undefined,
      col: undefined,
      seatType: undefined,
      carriageSeatIndex: undefined,
      sell: undefined,
      createTime: undefined,
      updateTime: undefined,
    });
    const daily_train_seats = ref([]);
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
      dataIndex: 'carriageIndex',
      key: 'carriageIndex',
    },
    {
      title: '排号',
      dataIndex: 'row',
      key: 'row',
    },
    {
      title: '列号',
      dataIndex: 'col',
      key: 'col',
    },
    {
      title: '座位类型',
      dataIndex: 'seatType',
      key: 'seatType',
    },
    {
      title: '同车箱座序',
      dataIndex: 'carriageSeatIndex',
      key: 'carriageSeatIndex',
    },
    {
      title: '售卖情况',
      dataIndex: 'sell',
      key: 'sell',
    },
    {
      title: '操作',
      dataIndex: 'operation'
    }
    ];



    const onEdit = (record) => {
      daily_train_seat.value = window.Tool.copy(record);
      visible.value = true;
    };

    const onDelete = (record) => {
      deleteDailyTrainStationSeat(record).then((response) => {
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
      saveDailyTrainStationSeat(daily_train_seat.value).then((response) => {
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
    const params=ref({
      date:"",
      trainCode:""
    });

    const handleQuery = (param) => {
      if (!param) {
        param = {
          page: 1,
          size: pagination.value.pageSize
        };
      }
      loading.value = true;
      getDailyTrainStationSeat(param.page,param.size,params.value).then((response) => {
        loading.value = false;
        if (response.code===200) {
          daily_train_seats.value = response.data.records;
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
      SEAT_COL_ARRAY,
      SEAT_TYPE_ARRAY,
      daily_train_seat,
      visible,
      daily_train_seats,
      pagination,
      columns,
      handleTableChange,
      handleQuery,
      loading,
      handleOk,
      onEdit,
      onDelete,
      params
    };
  },
});
</script>
