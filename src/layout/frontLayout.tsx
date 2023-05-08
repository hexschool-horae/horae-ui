import FrontFooter from "@/components/layout/FrontFooter";
import FrontHeader from "@/components/layout/FrontHeader";
import { PropsWithChildren } from "react";

export default function FrontLayout({ children }: PropsWithChildren<{}>) {
  return <>
    <div className="front-warp-layout">
      <FrontHeader></FrontHeader>
      <main>{children}</main>
      <FrontFooter></FrontFooter>
    </div>
  </>;
}
