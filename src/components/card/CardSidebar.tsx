
import style from './cardSidebar.module.scss';
import { Button } from 'primereact/button';
        
export default function CardSidebar() {
   

    return (
       <>
        <div className="pb-3">
            <div className={`${style.card_sidebar_title}`}>新增至卡片</div>
            <Button label="成員" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="優先權" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="待辦清單" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="標籤" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="日期" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="附件" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
        </div>
        <div>
            <div className={`${style.card_sidebar_title}`}>動作</div>
            <Button label="移動" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="複製" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="分享" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
            <Button label="番茄鐘" icon="pi pi-user"
                className={`${style.card_sidebar_btn}`}
            />
        </div>
       </>
    )
}
