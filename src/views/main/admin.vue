<template>
  <p>
    <a-space>
      <a-button type="primary" @click="handleQuery()">刷新</a-button>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </a-space>
  </p>
  <a-table :dataSource="admins"
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
      <!--        对type列的自定义操作-->
      <template v-else-if="column.dataIndex==='isDelete'">
          <span v-for="item in IS_DELETE_TYPE_ARRAY" :key="item.key">
            <span v-if="item.key===record.isDelete">
              {{item.value}}
            </span>
          </span>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="open" title="管理员" @ok="handleOk"
           ok-text="确认" cancel-text="取消">
    <a-form :model="admin" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="手机号">
        <a-input v-model:value="admin.mobile" />
      </a-form-item>
      <a-form-item label="密码">
        <a-input v-model:value="admin.password" />
      </a-form-item>
      <a-form-item label="创建时间">
        <a-date-picker v-model:value="admin.createTime" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="请选择日期" />
      </a-form-item>
      <a-form-item label="是否删除(0：没有删除1：已经删除)">
        <a-input v-model:value="admin.isDelete" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import {notification} from "ant-design-vue";
import {deleteAdmin, getAdmin, saveAdmin} from "@/API";

export default defineComponent({
  name: "admin-view",
  setup() {
    const open = ref(false);
    let admin = ref({
      id: undefined,
      mobile: undefined,
      password: undefined,
      createTime: undefined,
      isDelete: undefined,
    });
    const admins = ref([]);
    // 分页的三个属性名是固定的
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 10,
    });
    let loading = ref(false);
    const columns = [
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'isDelete',
      key: 'isDelete',
    },
    {
      title: '操作',
      dataIndex: 'operation'
    }
    ];

    const onAdd = () => {
      admin.value = {};
      open.value = true;
    };

    const onEdit = (record) => {
      admin.value = window.Tool.copy(record);
      open.value = true;
    };

    const onDelete = (record) => {
      deleteAdmin(record).then((response) => {
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
      saveAdmin(admin.value).then((response) => {
        if (response.code===200) {
          notification.success({description: "保存成功！"});
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
      getAdmin(param.page,param.size).then((response) => {
        loading.value = false;
        console.log(response)
        if (response.code===200) {
          admins.value = response.data.records;
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
      admin,
      open,
      admins,
      pagination,
      columns,
      handleTableChange,
      handleQuery,
      loading,
      onAdd,
      handleOk,
      onEdit,
      onDelete,
      IS_DELETE_TYPE_ARRAY:[{key:0,value:"在职"},{key:1,value:"离职"}]
    };
  },
});
</script>
