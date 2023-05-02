
import { useState } from 'react';
import styles from '../../styles/banner.module.scss';
import { InputText } from "primereact/inputtext";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'primereact/button';

export default function Banner() {
  const [value, setValue] = useState('');

  return <div className={`${styles.panel}`}>
      <section className="front-max-container banner-section flex sm:flex-row flex-col-reverse">
        <div className="section-left sm:w-1/2 w-full sm:py-28 py-5 sm:pr-6">
          <h1 className="mb-6">規劃，<span>成就進度</span> </h1>
          <p className="mb-10">你的時間由我來管理，讓你的一切僅然有序</p>
          <div className="form-group">
            <InputText placeholder='電子郵件' value={value} onChange={(e) => setValue(e.target.value)} />
            <Button label="免費註冊" severity="danger" rounded className="ml-3" />
          </div>
        </div>
        <div className="section-right sm:w-1/2 w-full">
           <Image src="/images/home-banner.png" alt="home-banner" className='sm:flex hidden' layout="responsive" width={746} height={497} />
           <Image src="/images/home-banner-mobile.png" alt="home-banner"  className='sm:hidden flex' layout="responsive" width={527} height={353} />
        </div>
      </section>
  </div>;
}
