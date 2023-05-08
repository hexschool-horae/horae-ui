import Image from 'next/image';
import { useState } from 'react';
import styles from './frontFooter.module.scss';

export default function FrontFooter() {
	return <>
		<footer >
			<div className="front-max-container">
				<div className={styles.top_row}>
					<Image className={`${styles.logo_img}`} src="/images/logo.svg" alt="Logo" width={148} height={48} />
				</div>
				<div className={styles.bottom_row}>
				<div className={styles.icon_box}>
						<div className={styles.icon}>
							<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="40" height="40" rx="20" fill="#F1F1F1"/>
								<path d="M22.6 14.4334H24.1666V11.7834C23.4081 11.7046 22.6459 11.6656 21.8833 11.6668C19.6166 11.6668 18.0666 13.0501 18.0666 15.5834V17.7668H15.5083V20.7334H18.0666V28.3334H21.1333V20.7334H23.6833L24.0666 17.7668H21.1333V15.8751C21.1333 15.0001 21.3666 14.4334 22.6 14.4334Z" fill="#606060"/>
							</svg>
						</div>
						<div className={styles.icon}>
							<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="40" height="40" rx="20" fill="#F1F1F1"/>
								<path d="M28.7168 14.9999C28.0751 15.2916 27.3834 15.4833 26.6668 15.5749C27.4001 15.1333 27.9668 14.4333 28.2334 13.5916C27.5418 14.0083 26.7751 14.2999 25.9668 14.4666C25.3084 13.7499 24.3834 13.3333 23.3334 13.3333C21.3751 13.3333 19.7751 14.9333 19.7751 16.9083C19.7751 17.1916 19.8084 17.4666 19.8668 17.7249C16.9001 17.5749 14.2584 16.1499 12.5001 13.9916C12.1918 14.5166 12.0168 15.1333 12.0168 15.7833C12.0168 17.0249 12.6418 18.1249 13.6084 18.7499C13.0168 18.7499 12.4668 18.5833 11.9834 18.3333V18.3583C11.9834 20.0916 13.2168 21.5416 14.8501 21.8666C14.3257 22.0101 13.7752 22.0301 13.2418 21.9249C13.4681 22.6353 13.9114 23.2569 14.5093 23.7024C15.1072 24.1478 15.8297 24.3947 16.5751 24.4083C15.3115 25.4086 13.7451 25.9493 12.1334 25.9416C11.8501 25.9416 11.5668 25.9249 11.2834 25.8916C12.8668 26.9083 14.7501 27.4999 16.7668 27.4999C23.3334 27.4999 26.9418 22.0499 26.9418 17.3249C26.9418 17.1666 26.9418 17.0166 26.9334 16.8583C27.6334 16.3583 28.2334 15.7249 28.7168 14.9999Z" fill="#606060"/>
							</svg>
						</div>
						<div className={styles.icon}>
							<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="40" height="40" rx="20" fill="#F1F1F1"/>
								<path fill-rule="evenodd" clip-rule="evenodd" d="M20 11C17.5557 11 17.2493 11.0104 16.2893 11.0542C15.3314 11.0979 14.6771 11.25 14.1047 11.4725C13.5128 11.7025 13.0109 12.0102 12.5105 12.5105C12.0102 13.0109 11.7025 13.5128 11.4725 14.1047C11.25 14.6771 11.0979 15.3314 11.0542 16.2893C11.0104 17.2493 11 17.5557 11 20C11 22.4443 11.0104 22.7507 11.0542 23.7107C11.0979 24.6686 11.25 25.3229 11.4725 25.8953C11.7025 26.4872 12.0102 26.9891 12.5105 27.4895C13.0109 27.9898 13.5128 28.2975 14.1047 28.5275C14.6771 28.75 15.3314 28.9021 16.2893 28.9458C17.2493 28.9896 17.5557 29 20 29C22.4443 29 22.7507 28.9896 23.7107 28.9458C24.6686 28.9021 25.3229 28.75 25.8953 28.5275C26.4872 28.2975 26.9891 27.9898 27.4895 27.4895C27.9898 26.9891 28.2975 26.4872 28.5275 25.8953C28.75 25.3229 28.9021 24.6686 28.9458 23.7107C28.9896 22.7507 29 22.4443 29 20C29 17.5557 28.9896 17.2493 28.9458 16.2893C28.9021 15.3314 28.75 14.6771 28.5275 14.1047C28.2975 13.5128 27.9898 13.0109 27.4895 12.5105C26.9891 12.0102 26.4872 11.7025 25.8953 11.4725C25.3229 11.25 24.6686 11.0979 23.7107 11.0542C22.7507 11.0104 22.4443 11 20 11ZM20 12.6216C22.4031 12.6216 22.6877 12.6308 23.6367 12.6741C24.5142 12.7141 24.9908 12.8607 25.3079 12.9839C25.728 13.1472 26.0278 13.3422 26.3427 13.6572C26.6577 13.9721 26.8527 14.2719 27.016 14.692C27.1392 15.0092 27.2859 15.4857 27.3259 16.3632C27.3692 17.3122 27.3783 17.5969 27.3783 20C27.3783 22.4031 27.3692 22.6877 27.3259 23.6367C27.2859 24.5142 27.1392 24.9908 27.016 25.3079C26.8527 25.728 26.6577 26.0278 26.3427 26.3427C26.0278 26.6577 25.728 26.8527 25.3079 27.016C24.9908 27.1392 24.5142 27.2859 23.6367 27.3259C22.6879 27.3692 22.4032 27.3783 20 27.3783C17.5967 27.3783 17.3121 27.3692 16.3632 27.3259C15.4857 27.2859 15.0092 27.1392 14.692 27.016C14.2719 26.8527 13.9721 26.6577 13.6572 26.3427C13.3423 26.0278 13.1472 25.728 12.9839 25.3079C12.8607 24.9908 12.7141 24.5142 12.6741 23.6367C12.6308 22.6877 12.6216 22.4031 12.6216 20C12.6216 17.5969 12.6308 17.3122 12.6741 16.3632C12.7141 15.4857 12.8607 15.0092 12.9839 14.692C13.1472 14.2719 13.3422 13.9721 13.6572 13.6572C13.9721 13.3422 14.2719 13.1472 14.692 12.9839C15.0092 12.8607 15.4857 12.7141 16.3632 12.6741C17.3122 12.6308 17.5969 12.6216 20 12.6216ZM15.3781 20.0001C15.3781 17.4476 17.4472 15.3785 19.9997 15.3785C22.5521 15.3785 24.6213 17.4476 24.6213 20.0001C24.6213 22.5525 22.5521 24.6217 19.9997 24.6217C17.4472 24.6217 15.3781 22.5525 15.3781 20.0001ZM19.9997 23C18.3428 23 16.9996 21.6569 16.9996 20.0001C16.9996 18.3432 18.3428 17 19.9997 17C21.6565 17 22.9996 18.3432 22.9996 20.0001C22.9996 21.6569 21.6565 23 19.9997 23ZM24.8043 16.2757C25.4008 16.2757 25.8844 15.7922 25.8844 15.1957C25.8844 14.5993 25.4008 14.1157 24.8043 14.1157C24.2079 14.1157 23.7244 14.5993 23.7244 15.1957C23.7244 15.7922 24.2079 16.2757 24.8043 16.2757Z" fill="#606060"/>
							</svg>
						</div>
					</div>
					<span>© 2023 Horae. All Right Researved.</span>
				</div>
			</div>
			
		</footer>
	</>;
}