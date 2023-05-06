import Link from "next/link";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppStore";

import { Button } from "primereact/button";
import axiosFetcher from "@/apis/axios";
import { setIsLogin, setToken } from "@/slices/userSlice";
const { post } = axiosFetcher;

export default function Header() {
  const router = useRouter();
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const dispatch = useAppDispatch();

  /** 登出 */
  const handleLogout = async () => {
    const result = await post<any>("/user/logout", null);

    if (result === undefined) return;

    // 清除loading狀態並清空token
    dispatch(setIsLogin(false));
    dispatch(setToken(""));
  };

  return (
    <div className="w-full">
      <div className="container flex items-center py-5 mx-auto">
        <Link href="/" passHref>
          <div className="nav-brand text-2xl">Horae</div>
        </Link>

        {isLogin ? (
          <div className="flex items-center ml-auto">
            <div className="border border-black rounded-full p-1 w-[2rem] h-[2rem] text-center">
              <span className="pi pi-user"></span>
            </div>
            <Button
              className="text-red-600"
              label="登出"
              onClick={() => handleLogout()}
              link
            />
          </div>
        ) : (
          <div className="ml-auto">
            <Button
              className="text-red-600"
              label="登入"
              onClick={() => router.push("/login")}
              link
            />
            <Button
              className=" bg-red-600"
              label="立即免費註冊"
              rounded
              onClick={() => router.push("/sign-up")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
