import Header from "@/components/home/Header";
import { PropsWithChildren } from "react";

export default function FrontLayout({ children }: PropsWithChildren<{}>) {
  return <>
    <div className="front-warp-layout">
      <Header></Header>
      <main>{children}</main>
    </div>
  </>;
}
