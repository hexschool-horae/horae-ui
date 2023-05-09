import Link from "next/link";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";

import { Button } from "primereact/button";
import axiosFetcher from "@/apis/axios";
import { setIsLogin, setToken } from "@/slices/userSlice";

import Image from 'next/image';
import styles from './frontHeader.module.scss';
import { useEffect, useState } from "react";

const { post } = axiosFetcher;

export default function FrontHeader() {
  const router = useRouter();
  const isLogin = useAppSelector((state: { user: { isLogin: boolean; }; }) => state.user.isLogin);
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);

  // header的透明度
  const opacity = scrollPosition > 0 ? Math.min(scrollPosition / 300, 1) : 0

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    
  }, [scrollPosition]);

  /** 登出 */
  const handleLogout = async () => {
    const result = await post<any>("/user/logout", null);

    if (result === undefined) return;

    // 清除loading狀態並清空token
    dispatch(setIsLogin(false));
    dispatch(setToken(""));
  };

  /** 切換選單 */
  const handleClick = () => {
    setIsActive(!isActive);
  };

  /** 設定 scroll value */
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  }

  return (
    <header className={`${styles.header} ${isActive ?  styles.show : ''}`}>
		  <div className={styles.fill} style={{ opacity: `${opacity}` }}></div>
			<div className={`${styles.navbar} front-max-container flex items-center`}>
			  <div className="header-left-panel sm:flex block items-center sm:w-auto w-full">
				  <div className="flex justify-between items-center">
            <Link href="/" passHref>
              <Image className={`${styles.logo_img}`} src="/images/logo.svg" alt="Logo" width={148} height={48} />
            </Link>
            <div className={`${styles.menu_btn_mobile} ${isActive ? styles.active : styles.close}`} onClick={handleClick}>
              <div className={styles.btn}></div>
            </div>
          </div>
        </div>
        <div className={styles.menu}>
          <nav className={styles.nav}>
            <ul className="sm:flex block text-base font-medium">
              <li className="flex items-center">功能介紹
                <svg className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </li>
              <li>使用者推薦</li>
            </ul>
          </nav>
          <div className={styles.right_panel}>
            {isLogin ? (
              <div className="flex items-center ml-auto">
                <div className="border border-black rounded-full p-1 w-[2rem] h-[2rem] text-center">
                  <span className="pi pi-user"></span>
                </div>
                <Button
                  className="text-red-600"
                  label="登出"
                  onClick={() => handleLogout()}
                  link
                />
              </div>
            ) : (
              <>
                <Button
                className="text-secondary px-5 sm:text-base text-sm focus:border-transparent"
                label="登入"
                onClick={() => router.push("/login")}
                link
              />
                <Button label="立即免費註冊" severity="secondary" rounded onClick={() => router.push("/sign-up")}/>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
