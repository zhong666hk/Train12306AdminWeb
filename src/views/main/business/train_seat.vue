<template>
  <p>
    <a-space>
      <Train-select-view v-model="params.trainCode" width="200px"></Train-select-view>
      <a-button type="primary" @click="handleQuery()">查找</a-button>
    </a-space>
  </p>
  <a-table :dataSource="train_seats"
           :columns="columns"
           :pagination="pagination"
           @change="handleTableChange"
           :loading="loading">
    <template #bodyCell="{ column, record }">

      <template v-if="column.dataIndex === 'col'">
        <span v-for="item in SEAT_COL_ARRAY" :key="item.key">
          <span v-if="item.key === record.col && item.type === record.seatType">
            {{item.value}}
          </span>
        </span>
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
  <a-modal v-model:open="open" title="座位" @ok="handleOk"
           ok-text="确认" cancel-text="取消">
    <a-form :model="train_seat" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="车次编号">
        <Train-select-view v-model="train_seat.trainCode"></Train-select-view>
      </a-form-item>
      <a-form-item label="厢序">
        <a-input v-model:value="train_seat.carriageIndex" />
      </a-form-item>
      <a-form-item label="排号">
        <a-input v-model:value="train_seat.row" />
      </a-form-item>
      <a-form-item label="列号">
        <a-select v-model:value="train_seat.col">
          <a-select-option v-for="item in SEAT_COL_ARRAY" :key="item.key" :value="item.key">
            {{item.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="座位类型">
        <a-select v-model:value="train_seat.seatType">
          <a-select-option v-for="item in SEAT_TYPE_ARRAY" :key="item.key" :value="item.key">
            {{item.value}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="同车厢座序">
        <a-input v-model:value="train_seat.carriageSeatIndex" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import {notification} from "ant-design-vue";
import {deleteTrainSeat, getTrainSeat, saveTrainSeat} from "@/API";
import TrainSelectView from "@/components/Train-select-view.vue";

export default defineComponent({
  name: "train_seat-view",
  components: {TrainSelectView},
  setup() {
    const SEAT_COL_ARRAY = window.SEAT_COL_ARRAY;
    const SEAT_TYPE_ARRAY = window.SEAT_TYPE_ARRAY;
    const open = ref(false);
    let train_seat = ref({
      id: undefined,
      trainCode: undefined,
      carriageIndex: undefined,
      row: undefined,
      col: undefined,
      seatType: undefined,
      carriageSeatIndex: undefined,
      createTime: undefined,
      updateTime: undefined,
    });
    const train_seats = ref([]);
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
      title: '厢序',
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
      title: '同车厢座序',
      dataIndex: 'carriageSeatIndex',
      key: 'carriageSeatIndex',
    },
    ];




    const onDelete = (record) => {
      deleteTrainSeat(record).then((response) => {
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
      saveTrainSeat(train_seat.value).then((response) => {
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

    const params=ref({
      trainCode:null
    })

    const handleQuery = (param) => {
      if (!param) {
        param = {
          page: 1,
          size: pagination.value.pageSize
        };
      }
      loading.value = true;
      getTrainSeat(param.page,param.size,params.value).then((response) => {
        loading.value = false;
        if (response.code===200) {
          train_seats.value = response.data.records;
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
      train_seat,
      open,
      train_seats,
      pagination,
      columns,
      handleTableChange,
      handleQuery,
      loading,
      handleOk,
      onDelete,
      params,
    };
  },
});
</script>
