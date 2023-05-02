import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'primereact/button';
import styles from '../../styles/header.module.scss';

export default function Header() {
	const [isActive, setIsActive] = useState(false);
	const handleClick = () => {
    setIsActive(!isActive);
  };

	return <>
		<header className={`${styles.header} ${isActive ?  styles.show : ''}`}>
			<div className={`${styles.header_fill} front-max-container flex justify-between items-center`}>
				<div className="header-left-panel sm:flex block items-center sm:w-auto w-full">
					<div className="flex justify-between items-center">
						<Image className={`${styles.logo_img}`} src="/images/logo.svg" alt="Logo" width={148} height={48} />
						<div className={`${styles.menu_btn_mobile} ${isActive ? styles.active : styles.close}`}  onClick={handleClick}>
							<div className={styles.btn}></div>
						</div>
					</div>
					<nav className={styles.nav}>
						<ul className="sm:flex block text-base font-medium">
							<li className="px-3.5 flex items-center">功能介紹
								<svg className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
								</svg>
							</li>
							<li>使用者推薦</li>
						</ul>
					</nav>
				</div>
				<div className={styles.right_panel}>
					<Link href="#" className="text-secondary-100 px-5">登入</Link>
					<Button label="立即免費註冊" severity="secondary" rounded/>
				</div>
			</div>
		</header>
	</>;
}