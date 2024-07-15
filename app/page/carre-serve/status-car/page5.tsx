import React from 'react';

import { Table,ConfigProvider,Input }from "antd" ;
import { PlusOutlined,FileExcelFilled,StopFilled,CheckSquareFilled,CheckOutlined ,CloseOutlined ,LoadingOutlined ,UserOutlined, PhoneOutlined, CarOutlined, AimOutlined, EnvironmentOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined} from '@ant-design/icons';

import { threadId } from 'worker_threads';
const dataSource = [
  {
    key: '1', name: 'Mike', age: 32, address: '10 Downing Street',
  },
  {
    key: '2', name: 'John', age: 42, address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'ไอดี',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'ชื่อรถ',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'ประเภทการจัดการ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Vender / Brand',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'วันที่ต่อสัญญา',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'วันที่หมดสัญญา',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'ราคา',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'รายละเอียด',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Rematk',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Active',
    dataIndex: 'address',
    key: 'address',
  },
];
const Page3: React.FC = () => {
  return (
  <div >
    <div className='value'>
      <h1 className='title-page' 
          style={{  textAlign:'center',
                    margin:' 0 0 20px 0',
                    backgroundColor:'#00CCFF',
                    borderRadius:'7px'             
      }}>
        รายละเอียดการจัดการรถยนต์
      </h1>
      <h1 className='manual' 
          style={{  fontSize:'16px',
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding:'0 0 0 10px',
                    gap: '10px'}}>
        <a style={{color:'black'}} href='#' ><FileExcelFilled style={{color:'black'}} /> Export Excel</a>
        <a  style={{color:'black',padding:'0 0 0 20px',}} href='#' ><PlusOutlined style={{color:'black'}} /> Export Excel</a>
      </h1>
      <h1 className='Search'
          style={{  fontSize:'16px',
            display:'flex',
            width:'300px',
            flexDirection: 'row',
            textAlign:'right',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'}}>search :
        <Input placeholder="search" style={{ flex: 1 }}></Input>
        
      </h1>
    </div>
      <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg:'#1E90FF',
            headerBorderRadius: 10,
            
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
