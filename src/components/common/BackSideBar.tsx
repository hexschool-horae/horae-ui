import axiosFetcher from "@/apis/axios";
import { IUserBoardDataRes } from "@/apis/models/res/i-user-board-data-res";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import WorkSpaceModel from "@/components/workSpaceModel";

const { get, post} = axiosFetcher;

interface dataRes {
  data: Array<IUserBoardDataRes>
}

export default function BackSideBar() {
  const router = useRouter();
  const [userBoardList, setUserBoardList] = useState<IUserBoardDataRes[]>([]);
  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  /** B02-2 取得登入者所有工作區標題清單 header sidebar 使用 --暫時取工作區使用--*/
  const handleGetWorkSpaceTitleData = async () => {
    console.log('--側邊攔--')
    const result = await get<dataRes>(
      "/work-space",
    );
    if (!result) return;
    setUserBoardList(result.data);
  }

  useEffect(() => {
    handleGetWorkSpaceTitleData();
  }, []);

  return <div className="sideBar w-[332px]">
    <nav>
      <ul>
        <li>
          <Button
            className="text-secondary px-5 sm:text-base text-sm focus:border-transparent"
            label="看板"
            onClick={() => router.push("/board")}
            link
            severity="info"
          />
        </li>
        <li>
          <div className="flex items-center justify-between">
            <Button
              className="text-secondary px-5 sm:text-base text-sm focus:border-transparent"
              label="工作區"
              link
              severity="info"
            />
            <div className="mr-5 text-secondary-3 cursor-pointer text-lg" onClick={showDialog}>+</div>
          </div>
          
          <ul className="ml-3">
          {
            userBoardList.map((item, index) => (
              <li key={index} >
                <Button
                  label={item.title}
                  link
                />
                <ul className="ml-3">
                  <li>
                    <Button
                      label="看板"
                      onClick={() => router.push(`/workspace/${item._id}`)}
                      size="small"
                      link
                      />
                  </li>
                  <li>
                    <Button
                      label="成員"
                      onClick={() => router.push(`/workspace/${item._id}/account`)}
                      size="small"
                      link
                      />
                  </li>
                  <li>
                    <Button
                      className="text-primary px-5 sm:text-base text-sm focus:border-transparent"
                      label="設定"
                      onClick={() => router.push("/workspace/members")}
                      size="small"
                      link
                      />
                    </li>
                </ul>
              </li>
            ))
          }
          </ul>
        </li>
      </ul>
    </nav>
    <WorkSpaceModel visible={visible} onHide={hideDialog} setVisible={setVisible} handleGetWorkSpaceTitleData={handleGetWorkSpaceTitleData}/>
  </div>;
}
