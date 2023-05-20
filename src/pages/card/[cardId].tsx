
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import style from './card.module.scss';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { CardDetailProvider, useCardDetail} from '@/contexts/cardDetailContext';
import CardSidebarButton from '@/components/card/CardSidebarButton';

    

export default function Card() {
  return (
   <CardDetailProvider>
      <CardInternal />
    </CardDetailProvider>
  )
}


function CardInternal() {
  const router = useRouter();
  const cardId = router.query.cardId;
  const { state, dispatch } = useCardDetail();

  useEffect(() => {
    // 測試用
    const timer = setTimeout(() => {
      dispatch({
        type: "INITIALIZE_CARD",
        payload: {
          cardDetail: {
            title: "test",
          },
        },
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);




  return (

    <Dialog visible={true} onHide={() => {}}
        className="w-full md:w-[800px] mx-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* main col */}
          <div className="md:col-span-5">
            <div className="text-[14px] mb-3">
              在列表<span className="pl-1">待辦事項</span>
            </div>

            <InputText value={state.cardDetail.title} 
              onChange={(e) => {
                dispatch({
                  type: "EDIT_TITLE",
                  payload: {
                    cardDetail: {
                      title: e.target.value,
                    },
                  },
                })
              }} 
              placeholder="卡片標題"
              className="w-full"
            />

   
          </div>
          {/* sidebar */}
          <div className="grid grid-cols-2 gap-4 md:gap-2 md:grid-cols-1 md:col-span-2">
            <h6 className={`${style.sidebar_title}`}>新增至卡片</h6>
            <CardSidebarButton name="成員" label="member"/>
            {/* <CardSidebarButton name="代辦清單" label="todos"/> */}
          
          </div>
        </div>
    </Dialog>
  )
}
