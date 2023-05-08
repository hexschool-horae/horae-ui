import { Key, useState } from "react";
import Image from 'next/image';
import homeStyles from './home.module.scss';
import styles from './userRecommend.module.scss';
import { Carousel } from 'primereact/carousel';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";


export default function UserRecommend() {
  const [list, setList] = useState([
    {
      name: "Jim K.",
      position: "Scrum Master",
      img: "home-educate",
      describe: "來旦買實用象。丁河上能左勿羽細京田，地林肉一北只在太嗎，因貫香神福幸世朵申見現現葉已左士成：有牙大錯回飽固買爪信您。由弟行同下那蝸心兄二戊欠吧棵巴品。法高封片耳流內完？院牙人雨對由細彩可首。因山哭言追才福會人童立。福旁媽帶行要他斥河校只看節王、生隻南姐想小童的。北很四行。",
      stars: [true, true, true, true, true],
    },
    {
      name: "個人計畫",
      position: "",
      img: "home-educate",
      describe: "幫助個人組織個人任務和計劃。可以使用它來追踪您的日常活動、個人目標和旅行計劃等。",
      stars: [true, true, true, true, false],
    },
    {
      name: "遠程工作團隊管理",
      position: "",
      img: "home-educate",
      describe: "可以清晰地規劃和追踪項目進度,並確保每個人都能清楚地了解自己的職責和期限。番茄鐘專注計時功能有助於團隊成員在家工作時保持高度專注,而即時通訊功能讓大家可以隨時交流問題和分享成果,維持良好的團隊氛圍。",
      stars: [true, true, true, false, false],
    },
    {
      name: "遠程工作團隊管理",
      position: "",
      img: "home-educate",
      describe: "可以清晰地規劃和追踪項目進度,並確保每個人都能清楚地了解自己的職責和期限。番茄鐘專注計時功能有助於團隊成員在家工作時保持高度專注,而即時通訊功能讓大家可以隨時交流問題和分享成果,維持良好的團隊氛圍。",
      stars: [true, true, true, true, false],
    },
  ]);

interface Item {
  name: string;
  position: string,
  img : string,
  describe: string,
  stars: Array<boolean>
}


const template = (item: Item) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.describe}>
          {item.describe}
        </div>
        <div className={styles.quotation_mark_box}>
          <svg width="37.16" height="31.03" viewBox="0 0 187 156" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M104.305 132.167L117.5 155.389C152.861 139.028 186.111 102.083 186.111 53C186.111 22.9167 167.111 0.222229 142.305 0.222229C117.5 0.222229 104.305 18.1667 104.305 36.1111C104.305 56.6945 118.028 72.5278 139.139 72.5278C144.417 72.5278 149.167 70.4167 152.333 68.8334C151.805 88.8889 134.389 117.389 104.305 132.167ZM0.861029 132.167L13.5277 155.389C49.4166 139.028 82.1388 102.083 82.1388 53C82.1388 22.9167 63.1388 0.222229 38.3333 0.222229C14.0555 0.222229 0.333252 18.1667 0.333252 36.1111C0.333252 56.6945 14.0555 72.5278 35.1666 72.5278C40.4444 72.5278 45.7221 70.4167 48.361 68.8334C47.8333 88.8889 30.4166 117.389 0.861029 132.167Z" fill="#F8E1E1"/>
          </svg>
        </div>
        
      </div>
      <div className="flex justify-end items-center">
        <div className={styles.personal_box}>
          <div className={styles.stars}>
            {item.stars.map((star: boolean, index: Key) => (
              <i className={`mr-[5px] text-xs pi pi-star${star ? '-fill' : ''}`} style={{ color: '#FFD600' }} key={index}></i>
              )
            )}
          </div>
          
          <div className={styles.user_info}>
            <h5 className="">{item.name}</h5>
            <h6 className="">{item.position}</h6>
          </div>
        </div>
        <Image className={styles.user_img} src={`/images/${item.img}.png`} alt={item.img} width={185.78} height={155.17} />
      </div>
    </div>
  );
};


  return <>
    <section className={styles.section}>
      <div className={`${styles.container} front-max-container`}>
        <h4 className={`${homeStyles.h3} text-secondary-300 ${styles.h3}`}>團隊愛上Horae的理由</h4>
          {/* <Carousel value={list} numVisible={1} numScroll={1} itemTemplate={template} /> */}
          <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {list.map((item, index) => (  
            <SwiperSlide key={index}>{template(item)}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  </>;
}