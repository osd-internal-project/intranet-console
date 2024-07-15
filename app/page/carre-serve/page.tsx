
'use client'
import React, { useState } from 'react';
import type { ConfigProviderProps, RadioChangeEvent ,} from 'antd';
import { UserOutlined, PhoneOutlined, CarOutlined, AimOutlined, EnvironmentOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined} from '@ant-design/icons';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { link } from 'fs';
import { Tabs } from 'antd';
import Carcalender from './calen-der/page1';
import Historycar from './histo-rycar/page2';
import Reservation from './Reser-vation/page3';
import Returning from './retur-ning/page4';
import Statuscar from './status-car/page5';
// import './page.css';

type SizeType = ConfigProviderProps['componentSize'];

const App: React.FC = () => { const [activeTab,setActiveTab]=useState<string>('1')

const changeTab=(key:string)=>{setActiveTab(key)}
  return (
    <div className='tabs_bar1'>
      <h1 style={{margin:'20px 0 0 0', 
                  border:'1px solid black',
                  fontSize:'30px',
                  fontStyle:'bold',
                  padding:'20px 0 20px 20px',
                  gap:'center',
                  borderRadius:'20px',
                  backgroundImage:'linear-gradient(to right,#0066FF, #3399FF , #33CCFF)'}}>
        การจองรถ
      </h1>
      
      <Tabs
        // defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key:string)=>{setActiveTab(key)}}
        style={{ marginBottom: 30 , }}
        items={[
          {
            label: 'ข้อมูลการจองรถ', key: '1', children: <Carcalender changeTab={changeTab} />,
          },
          {
            label: 'ทำการจองรถ',key: '2',children: <Historycar/>,
          },
          {
            label: 'การคืนรถ',key: '3',children: <Reservation/>,
          },
          {
            label: 'รายละเอียดรถยนต์',key: '4',children: <Returning/>,
          },
          {
            label: 'ประวัติการดำเนินการ',key: '5',children: <Statuscar/>,
          },
        ]}
      />
    </div>
  );
};

export default App;
