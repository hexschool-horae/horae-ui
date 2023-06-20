import Image from 'next/image'
import homeStyles from './home.module.scss'
import styles from './pomodoroDescription.module.scss'
import IconDoubleComma from '@/assets/icons/icon_double_comma.svg'

export default function PomodoroDescription() {
  return (
    <>
      <section className={styles.section}>
        <div className={`${styles.container} front-max-container`}>
          <h2 className={homeStyles.h2}>使用過番茄鐘和看板工具的使用者</h2>
          <p className={styles.subtitle}>您已經熟悉看板工具的強大功能和番茄鐘的高效專注方法，</p>
          <p className={styles.subtitle}>但是，想象一下，如果將它們結合在一起，您將獲得怎樣的協同效應？</p>
          <div className={styles.content}>
            <div className={styles.img_box}>
              <span></span>
              <Image src={'/images/home-pomodoro.png'} alt="home-pomodoro" width={700} height={700} />
            </div>
            <div className={styles.panel}>
              <div className={styles.describe}>
                <p>我們的產品將這兩個功能完美地融合在一起,讓您在組織和追踪任務時,同時保持專注和高效。</p>
                <p className="sm:mt-6 mt-5">不僅如此,我們還加入了成員即時通訊功能,讓團隊協作變得更為流暢！</p>
                <div className={styles.quotation_mark_box}>
                  <IconDoubleComma />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
