import React from 'react';

import { Table,ConfigProvider }from "antd" ;
const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  
  {
    title: '',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];
const Page3: React.FC = () => {
  return (
  <div>
      <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg:'#1E90FF'
          },
        },
      }}
    >
      <Table dataSource={dataSource} columns={columns} />
    </ConfigProvider>
  </div>
    
  );
};

export default Page3;
