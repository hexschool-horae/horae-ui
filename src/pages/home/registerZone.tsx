
import homeStyles from './home.module.scss';
import { InputText } from "primereact/inputtext";
import { useState } from 'react';
import { Button } from 'primereact/button';

export default function RegisterZone() {
  const [value, setValue] = useState('');
  return <>
    <section className={homeStyles.section}>
      <div className={`${homeStyles.container} front-max-container`}>
        <h3 className={`${homeStyles.h3} text-white`}>立即加入使用！</h3>
        <div className={`${homeStyles.form_group} m-auto  max-w-[447px]`}> 
            <InputText placeholder='電子郵件' value={value} onChange={(e) => setValue(e.target.value)} />
            <Button label="免費註冊" severity="danger" rounded className="sm:ml-3 ml-2" />
        </div>
      </div>
    </section>
  </>;
}
