import { FC, PropsWithChildren, ReactNode } from "react";

import { useAppSelector } from "@/hooks/useAppStore";
import DefaultLayout from "@/components/layout/DefaultLayout";
import AdminLayout from "@/components/layout/AdminLayout";

interface ComponentSelectorProps {
  children: ReactNode;
}

const Layout: FC<PropsWithChildren<ComponentSelectorProps>> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const isLogin = useAppSelector((state) => state.user.isLogin);
  if (!isLogin) {
    return <DefaultLayout>{children}</DefaultLayout>;
  } else {
    return <AdminLayout>{children}</AdminLayout>;
  }
};

export default Layout;
