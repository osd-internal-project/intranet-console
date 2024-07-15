import React from 'react';

import { Table,ConfigProvider,Input, }from "antd" ;
import { StopFilled,CheckSquareFilled,CheckOutlined ,CloseOutlined ,LoadingOutlined ,UserOutlined, PhoneOutlined, CarOutlined, AimOutlined, EnvironmentOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined} from '@ant-design/icons';


const dataSource = [
  {
    key: '1',
    id:'id 1200',
    status:'alive',
    name: 'Mike Khaotomsongcheung',
    brand: 'ฟีโน่ท่อแดง',
    datedata:'-',
    agent:'angle',
    denteils:'-',
  },
  {
    key: '2',
    id:'id 1200',
    status:'die',
    name: 'joey bongweet',
    brand: 'หัวเถิกซิ่ง',
    datedata:'12/07/2023',
    agent:'devil',
    denteils:'บนป้ายข้างวัด',
  },
];

const columns = [
  {
    title: 'สถาณะ',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'ไอดี',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'ชื่อ - นามสกุล',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'ชื่อรถ',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: 'วันที่ใช้งาน',
    dataIndex: 'datedata',
    key: 'datedata',
  },
  {
    title: 'ผู้อนุมัติ',
    dataIndex: 'agent',
    key: 'agent',
  },
  {
    title: 'รายละเอียด',
    dataIndex: 'denteils',
    key: 'denteils',
  },
];
const Page3: React.FC = () => {
  return (
  <div>
    <div className='value' style={{backgroundColor:'#F5F5F5'}}>
      <h1 className='title-page' 
          style={{  textAlign:'center',
                    margin:' 0 0 20px 0',
                    backgroundColor:'#00CCFF',
                    borderRadius:'7px'             
      }}>
        การคืนรถ
      </h1>
      <h1 className='manual' 
          style={{  fontSize:'16px',
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor:'#F5F5F5'
                  }}>
        <li ><CheckOutlined />อนุมัติแล้ว</li>
        <li ><LoadingOutlined /> รออนุมัติ </li>
        <li ><CloseOutlined />ไม่อนุมัติ</li>
        <li ><StopFilled /> ยกเลิกแล้ว</li>
        <li ><CheckSquareFilled /> แจ้งคืน</li>
        <li ><CarOutlined /> คืนแล้ว</li>
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
