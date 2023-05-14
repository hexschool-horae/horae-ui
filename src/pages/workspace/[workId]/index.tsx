import { IUserBoardDataRes } from '@/apis/models/res/i-user-board-data-res';
import WorkSpaceCard from '@/components/workSpaceCard';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface IBoardRes {
  discribe: string;
  status: string;
  title: string;
  viewSet: string;
  yourPermission: string;
  yourRole: string;
  _id: string;
}

export default function Home() {
  const router = useRouter();
  const wId = router.query.workId as string;
  const [workId, setWorkId] = useState("");
  const [workSpaceName, setWorkSpaceName] = useState("");
  const [boardData , setBoardDate ] = useState<IBoardRes>({
    discribe: '',
    status: '',
    title: '',
    viewSet: '',
    yourPermission: '',
    yourRole: '',
    _id: ''
  });
  
  useEffect (()=> {
    if(wId) {
      setWorkId(wId);
    }
  }, [wId])
  
  const handleAddWorkSpaceSuccess = () => {
    
  };
  const handleGetBard = (data: IBoardRes) => {
    setBoardDate(data);
    setWorkSpaceName(data.title.charAt(0))
    console.log(`bardData----!`, boardData);
  };

 
  return (
    <>
      <div className="header border-b mb-5 border-secondary-2">
        {
          boardData.title ? (
          <>
            <div className="flex pb-5">
              <span className="bg-primary text-white rounded py-3.5 px-[18px] mr-3">{workSpaceName}</span>
              <div className="title">
                <div className="edit-title flex items-center">
                   <h2 className="text-2xl">{boardData.title}</h2>
                   {/* <i className="pi pi-pencil ml-5"></i> */}
                </div>
                <p className="text-sm">{boardData.viewSet === "private" ? "私人":"公開"}</p>
              </div>
            </div>
          </>):('')
        }
      </div>
      <h3 className="text-secondary-3 text-xl"><i className="pi pi-user text-2xl mr-2 mb-6"></i>你的看板</h3>
      {/* 看板卡片 */}
      {
        workId ? 
         (<WorkSpaceCard workSpaceId={workId} handleAddWorkSpaceSuccess={handleAddWorkSpaceSuccess}  handleGetBard={handleGetBard}></WorkSpaceCard>) :('')
      }
     
    </>
  )
}
