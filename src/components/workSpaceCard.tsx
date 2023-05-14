import { useEffect, useRef, useState } from 'react';
import styles from './workSpaceCard.module.scss';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputTextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import axiosFetcher from "@/apis/axios";
import { IUserBoardDataRes } from '@/apis/models/res/i-user-board-data-res';
import router from 'next/router';

const { post, get } = axiosFetcher;

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

interface Props {
  workSpaceId: string;
  handleAddWorkSpaceSuccess: () => void;
  handleGetBard: (boardData: IBoardRes) => void;
}

type IWorkspaceFormReq = {
  title: string;
  discribe: string;
  viewSet: string;
  workSpaceId: string;
};

interface dataRes {
  data: {
    boards: Array<IUserBoardDataRes>;
    discribe: string;
    status: string;
    title: string;
    viewSet: string;
    yourPermission: string;
    yourRole: string;
    _id: string;
  }
}

interface IBoardRes {
  discribe: string;
  status: string;
  title: string;
  viewSet: string;
  yourPermission: string;
  yourRole: string;
  _id: string;
}


export default function WorkSpaceCard({workSpaceId, handleGetBard, handleAddWorkSpaceSuccess}: Props) {
  const newWorkSpaceOverlayPanel = useRef<OverlayPanel>(null);
  const [viewSetList, setViewSetList] = useState([
    {
      name: "公開",
      value: "public"
    },
    {
      name: "私人",
      value: "private"
    }
  ])

  const [selectedViewSet, setSelectedViewSet] = useState("public");
  const [boardList, setBoardList] = useState<IUserBoardDataRes[]>([]);
  const [dataResList, setDataResList] = useState<IBoardRes>({
    discribe: '',
    status: '',
    title: '',
    viewSet: '',
    yourPermission: '',
    yourRole: '',
    _id: ''
  });

  const WorkspaceValues: IWorkspaceFormReq = {
    title: "",
    discribe: "",
    viewSet: "public", //看板觀看權限,預設public (private, public)
    workSpaceId: workSpaceId
  };

  const { handleSubmit, control, formState: { errors }, reset } = useForm<IWorkspaceFormReq>({
    defaultValues: WorkspaceValues,
    resolver: yupResolver(schema),
  });

  useEffect(()=> {
    handleGetWorkSpaceData();
  }, [workSpaceId]);

  // 
  useEffect(() => {
    handleGetBard(dataResList);
  }, [dataResList]);

 /** B02-5 取得單一工作區 --暫時用--*/
  const handleGetWorkSpaceData = async () => {
    const result = await get <dataRes>(
      `/work-space/${workSpaceId}`,
    );
    if (!result) return;
    // console.log('result', result)
    // console.log('result.data', result.data);
    setDataResList(result.data);
    setBoardList(result.data.boards);
  }

  const handleCreateBoard = async(reqData: IWorkspaceFormReq) => {
    reqData.viewSet = selectedViewSet;
    // console.log('reqData', reqData);

     const result = await post(
      "/board",
      reqData,
    );
    if (!result) return;
    handleHide();
    // 呼叫祖頁面 取得資料方法
    // handleAddWorkSpaceSuccess();
    handleGetWorkSpaceData();
  };

  const handleHide = () => {
    newWorkSpaceOverlayPanel.current?.hide(); // 關閉 OverlayPanel
  }

  const onSubmit = (data: IWorkspaceFormReq) => {
    handleCreateBoard(data);
    reset();
  };

  const goBoard = (boardId: string) => {
    router.push(`/board/${boardId}`);
  }

  return <div>
    {/* 既有看版 */}
    <div className="flex w-full flex-wrap">
      {
      boardList.map((item) => (
          <>
            <div key={item._id} className={styles.card} onClick={() => goBoard(item._id)}>
              <p>{item.title}</p>
            </div>
          </>
        ))
      }
      {/* 建立看版 */}
      <div className={`${styles.card} ${styles.new_card}`} onClick={(e) => newWorkSpaceOverlayPanel.current?.toggle(e)}>
        <div className={styles.add} >+</div>
      </div>
    </div>
    

    <OverlayPanel ref={newWorkSpaceOverlayPanel} className="work-space-overlay-panel" showCloseIcon>
      <p className="text-center">建立看板</p>
      <div className="content">
        {/* 新建 看板表單 */}
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col pb-6">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => ( 
                  <>
                    <label htmlFor={field.name}>看板名稱</label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={classNames({ "p-invalid": fieldState.error })}
                      placeholder="請輸入名稱"
                    />
                  </>
                )}
              />
              {errors.title && <small className="p-error">{errors.title.message}</small>}
            </div>
            <div className="flex flex-col pb-6">
              <label htmlFor="">觀看權限</label>
              <Dropdown value={selectedViewSet} onChange={(e) => setSelectedViewSet(e.value)} options={viewSetList} optionLabel="name" className="w-full md:w-14rem" />
            </div>
            <div className="flex flex-col pb-6">
              <Controller
                name="discribe"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                  <label htmlFor={field.name}>看板描述(選填)</label>
                  <InputTextarea id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)} autoResize
                      className={classNames({ "p-invalid": fieldState.error })}
                      placeholder="請輸入描述內容"
                      rows={5} cols={30} />
                  </>
                  
                )}
              />
              {errors.discribe && <small className="p-error">{errors.discribe.message}</small>}
            </div>
            <div className="btn-box text-right">
              <Button className="w-full" type="submit" label="建立" severity="secondary" size="small" rounded/>
            </div>
          </form>
      </div>
    </OverlayPanel>
  </div>;
}