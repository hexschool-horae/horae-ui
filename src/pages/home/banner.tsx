
import { useState } from 'react';
import homeStyles from './home.module.scss';
import styles from './banner.module.scss';
import { InputText } from "primereact/inputtext";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'primereact/button';

export default function Banner() {
  const [value, setValue] = useState('');

  return <div className={`${styles.panel}`}>
      <section className={`${styles.section} front-max-container`}>
        <div className="section-left sm:w-1/2 w-full sm:py-28 py-5 sm:pr-6">
          <h1 className="mb-6">規劃，<span>成就進度</span> </h1>
          <p className="mb-10">你的時間由我來管理，讓你的一切僅然有序</p>
          <div className={homeStyles.form_group}>
            <InputText className="border-transparent" placeholder='電子郵件' value={value} onChange={(e) => setValue(e.target.value)} />
            <Button label="免費註冊" severity="danger" rounded className="sm:ml-3 ml-2" />
          </div>
        </div>
        <div className="section-right sm:w-1/2 w-full">
           <Image src="/images/home-banner.png" alt="home-banner" className='sm:flex hidden' style={{objectFit: 'cover', objectPosition: 'center center'}} width={746} height={497} />
           <Image src="/images/home-banner-mobile.png" alt="home-banner"  className='sm:hidden flex' style={{objectFit: 'cover', objectPosition: 'center center'}} width={527} height={353} />
        </div>
      </section>
  </div>;
}
