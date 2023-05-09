import { useState } from "react";
import Image from 'next/image';
import homeStyles from './home.module.scss';
import styles from './productDescription.module.scss';

export default function ProductDescription() {
  const [list, setList] = useState([
    {
      title: "任務",
      decorativeTitle: "看板管理",
      img: "home-kanban",
      describe: "卡片是推動任務的最小單位，你可創建和編輯任務卡片，將相關資訊整合在一起。拖移任務卡片，放入相應的狀態列表，使每個任務的工作狀態清晰可見。看板呈現讓專案一目瞭然，隨時依狀況調整和擴充，輕鬆打造符合需求的執行捷徑。"
    },
    {
      title: "分配",
      decorativeTitle: "團隊任務",
      img: "home-team",
      describe: "工作事項可以切分為小任務，專案管理者可以將小任務指派給組員，讓團隊一起同步執行各項任務來達成目標。"
    },
    {
      title: "即時",
      decorativeTitle: "聊天",
      img: "home-chat",
      describe: "通過即時聊天不用再另外使用其它通訊軟體，加速團隊溝通。你也可以標記個人，為行動項目分配評論，並鏈結任務以共同完成更多工作。"
    },
    {
      title: "專注",
      decorativeTitle: "計時",
      img: "home-timing",
      describe: "通過即時聊天不用再另外使用其它通訊軟體，加速團隊溝通。你也可以標記個人，為行動項目分配評論，並鏈結任務以共同完成更多工作。"
    }
  ]);
  return <>
    <section>
      <div className="p-decorative-circle p-left-decorative-circle-1"></div>
      <div className="p-decorative-circle p-right-decorative-circle-1"></div>
      <div className="p-decorative-circle p-right-decorative-circle-2"></div>
      <div className="front-max-container">
        {list.map((item, index) => (  
          <div className={`${styles.item} ${(index + 1) % 2 === 0 ? styles.asc: styles.desc}`} key={index}>
            <div className={`sm:w-1/2 w-full ${(index + 1) % 2 === 0 ? 'sm:pr-20': 'sm:pl-20'}`}>
              <div className={`${styles.header} ${(index + 1) % 2 === 0 ?  styles.desc: styles.asc}`}>
                <h3  className={homeStyles.h3}>{item.title}</h3>
                <h3 className={`${homeStyles.h3} text-primary`}>{item.decorativeTitle}</h3>
              </div>
              <div className={styles.describe}>
                <p>{item.describe}</p>
              </div>
            </div>
            <div className="sm:w-1/2 w-full">
              <Image src={`/images/${item.img}.png`} alt={item.img} style={{objectFit: 'cover', objectPosition: 'center center'}} width={600} height={400} />
            </div>
            
          </div>
        ))}
      </div>
    </section>
  </>;
}
