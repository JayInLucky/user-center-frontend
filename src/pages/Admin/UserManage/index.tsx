import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {useRef} from 'react';
import {searchUsers} from "@/services/ant-design-pro/api";
import {Image} from "antd";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};



const columns: ProColumns<API.CurrentUser>[] = [
  {
    title: '序号',
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
    align: 'center'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '用户账号',
    dataIndex: 'userAccount',
    copyable: true,
    align: 'center'
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render:(_,record)=>(
      <div>
        <Image src={record.avatarUrl} width={100} />
      </div>
    ),
    copyable: true,
    align: 'center',
  },
  {
    title: '  性别 ',
    dataIndex: 'gender',
    // 枚举
    valueType: 'select',
    valueEnum: {
      0:{
        text:'男',
      },
      1:{
        text:'女',
      }
    },
    align: 'center',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
    align: 'center',
  },
  {
    title: '邮件',
    dataIndex: 'email',
    copyable: true,
    align: 'center',
  },
  {
    title: '   状态',
    dataIndex: 'userStatus',
    align: 'center',
  },
  {
    title: '   星球编号',
    dataIndex: 'planetCode',
    align: 'center',
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0:{
        text:'普通用户',
        status:'Default'
      },
      1:{
        text:'管理员',
        status:'Success',
      }
    },
  },
  {
    title: '   创建时间',
    dataIndex: 'createTime',
    valueType:'dateTime'
  },

  {
    title: '操作',
    align: 'center',
    valueType: 'option',
    key: 'option',


    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // 获取后端的数据，返回到表格
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        await waitTime(2000);
        const  userList=await searchUsers();
        return{
          data: userList
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value){
          console.log("value:",value)
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting:{
          listsHeight:400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"></ProTable>
  );
};
