import { ReactNode } from "react";
import BackHeader from "../common/BackHeader";
import BackSideBar from "../common/BackSideBar";

export default function BackLayout({ children }: { children?: ReactNode }) {
  return (
    <>
      <BackHeader/>
      <div className="flex">
        <BackSideBar/>
        <main className="main back-main bg-secondary-4 p-12 min-h-[100vh]">{children}</main>
      </div>
      
    </>
  );
}