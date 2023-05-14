import { Button } from "primereact/button";
import ListSettingMenu from "./BoardSettingMenu";

export default function CardList() {
  return (
    <div className="bg-secondary-4 flex flex-col justify-center px-4 py-5">
      <div className="flex items-center mb-3">
        <h6 className="text-lg text-secondary-3 mr-auto ">列表名稱</h6>
        <ListSettingMenu />
      </div>

      {/* 卡片本體 */}
      <div className="bg-white p-4 mb-3">Card</div>

      <Button className="text-secondary-3 p-0" label="+ 新增卡片" text />
    </div>
  );
}
