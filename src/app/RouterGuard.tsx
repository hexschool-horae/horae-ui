import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import useUserState from "@/hooks/useUserState";

// 不需要權限驗證的路由
const nonAuthPaths = ["/login", "/register"];

const RouterGuard = ({ children }: { children?: ReactNode }) => {
  const router = useRouter();
  const { pathname } = router;

  const userState = useUserState();
  const {
    state: { isLogin },
  } = userState;
  // 路由權限驗證
  useEffect(() => {
    if (isLogin) {
      if (pathname === "/login") {
        router.push("/");
      }
    } else {
      if (!nonAuthPaths.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [router, pathname, isLogin]);

  return <>{children}</>;
};

export default RouterGuard;
