import { useState } from "react";
import Image from 'next/image';
import styles from './teamUse.module.scss';

export default function TeamUse() {
  const [companyList, setCompanyList] = useState(['digg','reddit','wordPress','piedPiperPP','fontAwesome']);
  const [companyList2, setCompanyList2] = useState(['CSS3','stumble','google','piedPiper','slack','joomla']);

  return <>
    <section className={styles.section}>
    <div className="t-decorative-circle t-left-decorative-circle"></div>
    <div className="t-decorative-circle  t-right-decorative t-right-decorative-circle-1"></div>
    <div className="t-decorative-circle  t-right-decorative t-right-decorative-circle-2"></div>
      <div className={`${styles.container} front-max-container`}>
        <h4>協助世界各地團隊</h4>
        <h2>打造完美管理計畫</h2>    
        <div className={styles.content}>   
            <div className={styles.top_row}>
              { companyList.map((item, index) => ( 
                <div className={styles.icon} key={index}>
                  <Image src={`/images/teamUse/${item}.png`} alt={item}  width={80} height={80} layout="responsive"/>
                </div>
              ))}
            </div>
            <div  className={styles.bottom_row}>
              { companyList2.map((item, index) => ( 
                <div className={styles.icon} key={index}>
                  <Image src={`/images/teamUse/${item}.png`} alt={item}  width={80} height={80}  layout="responsive"/> 
                </div>
              ))}
              </div>
          </div>
      </div>
    </section>
  </>;
}
