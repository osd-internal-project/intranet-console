import React from 'react';
import { Calendar ,Button} from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import type { CalendarProps } from 'antd';
// import type { Dayjs } from 'dayjs';
// import './page1.css'
import Reservation from '../Reser-vation/page3';
export interface Prop{changeTab:(key:string)=>void}
const App: React.FC<Prop> = ({changeTab}) => {
  

  return (
      <div style={{ backgroundColor: '#FFFAFA',
                    padding: '50px 0 50px 0'
      }}>
        <h1 style={{display: 'flex', justifyContent: 'center', alignItems: 'center',color: 'while'}}>
        <Button  type="primary" style={{margin: 10}} href='#' >แสดงข้อมูลแบบปฏิทิน</Button>
        <Button  type="primary" style={{margin: 10}}  >แสดงข้อมูลแบบตาราง</Button>
        <Button  type="primary" style={{margin: 10}} onClick={()=>{changeTab('3')}} >สถานะล่าสุด</Button>
        </h1>
      <Calendar style={{backgroundColor: '#FFFAFA'}}/>
      </div>
      
  )
};

export default App;