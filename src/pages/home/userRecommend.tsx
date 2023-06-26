import { Key, useRef, useState } from 'react'
import Image from 'next/image'
import homeStyles from './home.module.scss'
import styles from './userRecommend.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper'
import IconDoubleComma from '@/assets/icons/icon_double_comma.svg'

export default function UserRecommend() {
  const userRecommendationRef = useRef(null)
  const [list] = useState([
    {
      name: 'Jim K.',
      position: 'Scrum Master',
      img: 'r-avatar1',
      describe:
        'Horae完全改變了我們團隊的專案管理方式。直觀易用的視覺看板讓我們能夠一目了然地追蹤任務和進度。它極大地提升了我們的生產力和協作效率。',
      stars: [true, true, true, true, true],
    },
    {
      name: 'Anna',
      position: 'Executive',
      img: 's-avatar1',
      describe:
        '我喜歡Horae的可自定義性。從創建自定義標籤和標記到設置，它能夠適應我們獨特的專案管理需求。它的靈活性適用於個人、小型團隊和大型組織。',
      stars: [true, true, true, true, false],
    },
    {
      name: 'Melinda',
      position: 'Project Manager',
      img: 's-avatar2',
      describe:
        '社群非常樂於助人和支持。無論是尋找新的看板設置靈感還是解決問題，都有豐富的資源和積極的用戶準備提供幫助。社群為整個Horae體驗增添了價值。',
      stars: [true, true, true, false, false],
    },
    {
      name: 'Jennifer',
      position: 'Advisory Engineer',
      img: 's-avatar4',
      describe: 'Horae看板功能非常實用，可以根據項目、任務或工作流程來組織和管理我的工作。',
      stars: [true, true, true, true, false],
    },
  ])

  interface Item {
    name: string
    position: string
    img: string
    describe: string
    stars: Array<boolean>
  }

  const template = (item: Item) => {
    return (
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.describe}>{item.describe}</div>
          <div className={styles.quotation_mark_box}>
            <IconDoubleComma />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <div className={styles.personal_box}>
            <div className={styles.stars}>
              {item.stars.map((star: boolean, index: Key) => (
                <i
                  className={`mr-[5px] text-xs pi pi-star${star ? '-fill' : ''}`}
                  style={{ color: '#FFD600' }}
                  key={index}
                ></i>
              ))}
            </div>
            <div className={styles.user_info}>
              <h5 className="">{item.name}</h5>
              <h6 className="">{item.position}</h6>
            </div>
          </div>
          <Image
            className={styles.user_img}
            src={`/images/avatar/${item.img}.jpg`}
            alt={item.img}
            width={185.78}
            height={155.17}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <section ref={userRecommendationRef} id="userRecommendation" className={styles.section}>
        <div className={`${styles.container} front-max-container`}>
          <h4 className={`${homeStyles.h3} text-secondary-3 ${styles.h3}`}>團隊愛上Horae的理由</h4>
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
    </>
  )
}
