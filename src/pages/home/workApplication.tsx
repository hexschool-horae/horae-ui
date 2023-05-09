import { useState } from "react";
import Image from 'next/image';
import homeStyles from './home.module.scss';
import styles from './workApplication.module.scss';
import { Dialog } from 'primereact/dialog';

export default function WorkApplication() {
  const [list, setList] = useState([
    {
      title: "教育",
      img: "home-educate",
      describe: "作為教育工具使用,幫助老師和學生更好地組織和追踪學習進度。老師可以創建板,列出每週的任務和活動,學生可以在每個卡片上提交作業。"
    },
    {
      title: "個人計畫",
      img: "home-plan",
      describe: "幫助個人組織個人任務和計劃。可以使用它來追踪您的日常活動、個人目標和旅行計劃等。"
    },
    {
      title: "遠程工作團隊管理",
      img: "home-remote",
      describe: "可以清晰地規劃和追踪項目進度,並確保每個人都能清楚地了解自己的職責和期限。番茄鐘專注計時功能有助於團隊成員在家工作時保持高度專注,而即時通訊功能讓大家可以隨時交流問題和分享成果,維持良好的團隊氛圍。"
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({
    title: "",
    img: "",
    describe:"",
  });
interface List {
  title: string;
  img: string;
  describe: string;
}
  const handleClick = (item: List) => {
    setVisible(true);
    setSelectItem(item);
  };

  return <>
    <section className={styles.section}>
      <div className={`${styles.container} front-max-container`}>
       <h3 className={`${homeStyles.h3} text-secondary-3 ${styles.h3}`}>可彈性應用於各種工作流程</h3>
        <div className={styles.card_area}>
          {list.map((item, index) => (  
            <div className={`${styles.card} w-1/3`} key={index}>
              <div className={styles.img_box}>
                <Image src={`/images/${item.img}.png`} alt={item.img} style={{objectFit: 'cover', objectPosition: 'center center'}} width={600} height={400} />
                <div className={styles.add} onClick={() =>  handleClick(item)}>+</div>
              </div>
              <div>
                <div className={styles.header}>
                  <h3 className="sm:text-2xl text-xl font-medium">{item.title}</h3>
                </div>
                <div className={styles.describe}>
                  <p>{item.describe}</p>
                </div>
              </div>
            </div>
          ))}
        </div> 
      </div>
      
      <Dialog className="home-dialog" visible={visible} style={{margin: '24px' }} draggable={false} onHide={() => setVisible(false)}>
        <div className="m-0 sm:flex block">
          <div className="sm:w-1/2 w-full">
            <Image src={`/images/${selectItem.img}.png`} alt={selectItem.img} style={{objectFit: 'cover', objectPosition: 'center center'}} width={600} height={400} />
          </div>
          <div className={styles.dialog_right_panel}>
            <div className="pb-3">
              <h3 className="sm:text-3xl text-2xl font-medium">{selectItem.title}</h3>
            </div>
            <div className={styles.dialog_describe}>
              <p>{selectItem.describe}</p>
            </div>
          </div>
        </div>
      </Dialog>
    </section>
  </>;
}