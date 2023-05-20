import Image from 'next/image'
import Link from 'next/link'
import styles from './frontFooter.module.scss'
import IconInstgram from '@/assets/icons/icon_instgram.svg'
import IconFacebook from '@/assets/icons/icon_facebook.svg'
import IconTwitter from '@/assets/icons/icon_twitter.svg'

export default function FrontFooter() {
  return (
    <>
      <footer>
        <div className="front-max-container">
          <div className={styles.top_row}>
            <Link href="/" passHref>
              <Image className={`${styles.logo_img}`} src="/images/logo.svg" alt="Logo" width={148} height={48} />
            </Link>
          </div>
          <div className={styles.bottom_row}>
            <div className={styles.icon_box}>
              <div className={styles.icon}>
                <IconFacebook />
              </div>
              <div className={styles.icon}>
                <IconTwitter />
              </div>
              <div className={styles.icon}>
                <IconInstgram />
              </div>
            </div>
            <span>© 2023 Horae. All Right Researved.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
