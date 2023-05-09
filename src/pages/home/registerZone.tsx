
import homeStyles from './home.module.scss';
import { useState } from 'react';
import RegisterEmailForm from './registerEmailForm';

export default function RegisterZone() {
  const [value, setValue] = useState('');
  return <>
    <section className={homeStyles.section}>
      <div className={`${homeStyles.container} front-max-container`}>
        <h3 className={`${homeStyles.h3} text-white`}>立即加入使用！</h3>
        
        <div className={`${homeStyles.form_group} m-auto max-w-[447px]`}> 
          <RegisterEmailForm label="免費註冊" severity="danger"></RegisterEmailForm>
        </div>
      </div>
    </section>
  </>;
}
