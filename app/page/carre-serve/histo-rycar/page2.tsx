import React from 'react';
import { Form, Input, Button, DatePicker, TimePicker, Select,Flex ,Cascader, InputNumber, Space,InputNumberProps} from 'antd';
import { UserOutlined, PhoneOutlined, CarOutlined, AimOutlined, EnvironmentOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const onChange1 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log('Change:', e.target.value);
};

const provinces = [
  'จังหวัด กรุงเทพมหานคร',
  'จังหวัด กระบี่',
  'จังหวัด กาญจนบุรี',
  'จังหวัด กาฬสินธุ์',
  'จังหวัด กำแพงเพชร',
  'จังหวัด ขอนแก่น',
  'จังหวัด จันทบุรี',
  'จังหวัด ฉะเชิงเทรา',
  'จังหวัด ชลบุรี',
  'จังหวัด ชัยนาท',
  'จังหวัด ชัยภูมิ',
  'จังหวัด ชุมพร',
  'จังหวัด เชียงราย',
  'จังหวัด เชียงใหม่',
  'จังหวัด ตรัง',
  'จังหวัด ตราด',
  'จังหวัด ตาก',
  'จังหวัด นครนายก',
  'จังหวัด นครปฐม',
  'จังหวัด นครพนม',
  'จังหวัด นครราชสีมา',
  'จังหวัด นครศรีธรรมราช',
  'จังหวัด นครสวรรค์',
  'จังหวัด นนทบุรี',
  'จังหวัด นราธิวาส',
  'จังหวัด น่าน',
  'จังหวัด บึงกาฬ',
  'จังหวัด บุรีรัมย์',
  'จังหวัด ปทุมธานี',
  'จังหวัด ประจวบคีรีขันธ์',
  'จังหวัด ปราจีนบุรี',
  'จังหวัด ปัตตานี',
  'จังหวัด พระนครศรีอยุธยา',
  'จังหวัด พะเยา',
  'จังหวัด พังงา',
  'จังหวัด พัทลุง',
  'จังหวัด พิจิตร',
  'จังหวัด พิษณุโลก',
  'จังหวัด เพชรบุรี',
  'จังหวัด เพชรบูรณ์',
  'จังหวัด แพร่',
  'จังหวัด ภูเก็ต',
  'จังหวัด มหาสารคาม',
  'จังหวัด มุกดาหาร',
  'จังหวัด แม่ฮ่องสอน',
  'จังหวัด ยโสธร',
  'จังหวัด ยะลา',
  'จังหวัด ร้อยเอ็ด',
  'จังหวัด ระนอง',
  'จังหวัด ระยอง',
  'จังหวัด ราชบุรี',
  'จังหวัด ลพบุรี',
  'จังหวัด ลำปาง',
  'จังหวัด ลำพูน',
  'จังหวัด เลย',
  'จังหวัด ศรีสะเกษ',
  'จังหวัด สกลนคร',
  'จังหวัด สงขลา',
  'จังหวัด สตูล',
  'จังหวัด สมุทรปราการ',
  'จังหวัด สมุทรสงคราม',
  'จังหวัด สมุทรสาคร',
  'จังหวัด สระแก้ว',
  'จังหวัด สระบุรี',
  'จังหวัด สิงห์บุรี',
  'จังหวัด สุโขทัย',
  'จังหวัด สุพรรณบุรี',
  'จังหวัด สุราษฎร์ธานี',
  'จังหวัด สุรินทร์',
  'จังหวัด หนองคาย',
  'จังหวัด หนองบัวลำภู',
  'จังหวัด อ่างทอง',
  'จังหวัด อำนาจเจริญ',
  'จังหวัด อุดรธานี',
  'จังหวัด อุตรดิตถ์',
  'จังหวัด อุทัยธานี',
  'จังหวัด อุบลราชธานี',
];



const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};
const ProvinceDropdown : React.FC = () => {
  const handleChange = (value: string) => {
    console.log(`Selected: ${value}`);};
 return(
  <div style={{ display:'inline-block',
                backgroundColor:'#FFFAFA', 
                height:'700px',
                width:'100%',
                padding:'0 0 0 20px' }}>
    <h1 className='title' style={{fontSize:'18px'}}>ข้อมูลผู้ใช้งาน</h1>
    <h1 style={{display:'inline-flex', gap:'10px'}}>
      <Input size="large" addonBefore={<UserOutlined />} placeholder="ชื่อผู้ใช้งาน" />
      <Input size="large" addonBefore={<PhoneOutlined />} placeholder="เบอร์โทรศัพท์" />
      <Input size="large" addonBefore={<UserOutlined />} placeholder="โปรดระบุแผนก" />
    </h1>
    <h1 className='title2' style={{fontSize:'18px'}}>ข้อมูลการจองและการใช้งาน</h1>
    <h1 style={{display:'inline-flex', gap:'10px'}}>
     <Input size="large" addonBefore={<CarOutlined />} placeholder="ยี่ห้อรถ" />
     <Input size="large" addonBefore={<AimOutlined />} placeholder="วัตถุประสงค์การใช้งาน" />
     <Input size="large" addonBefore={<EnvironmentOutlined />} placeholder="สถานที่ไป" />
     <Input.Group compact>
      
     <Select  size="large" style={{ width: '250px' }} placeholder="เลือกจังหวัด" onChange={handleChange} >
        {provinces.map((province) => (
          <Option size="large" addonBefore={<EnvironmentOutlined />}  key={province} value={province}>
            {province}
          </Option>
        ))}
    </Select>
    </Input.Group>
    </h1>
    <h1 className='title3' style={{fontSize:'18px'}}>ข้อมูลจำนวนผู้ใช้และเวลา</h1>
    <h1  style={{ gap:'10px',height:'10px ',width:'300px'}}>
      <InputNumber size="large" addonBefore={<TeamOutlined />} placeholder="จำนวนผู้ใช้" min={1} max={20} onChange={onChange}/>
      <DatePicker size="large"
        onChange={onChange}
        placeholder="วันที่ใช้รถ"
        style={{ width: '100%', borderRadius: '8px', color:'black'}}
      />
      <TimePicker

      placeholder="เวลา"
      style={{ width: '100%', borderRadius: '8px' }}
      />
      <DatePicker size="large"

        placeholder="วันที่เสร็จ"
        style={{ width: '100%', borderRadius: '8px', color:'black'}}
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <TimePicker

        placeholder="เวลา"
        style={{ width: '100%', borderRadius: '8px' }}
      />
    </div>
      <Input  size="large" showCount maxLength={200} placeholder="อื่นๆ..." style={{height:'120px',resize: 'none'}}/>
      <Button size="large" type="primary">ยืนยันการจอง</Button>
     </h1>
  </div>
 );
};
export default ProvinceDropdown;