import { ReactNode } from "react";
import Header from "@/components/common/Header";

export default function DefaultLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="container mx-auto ">
      <Header />
      <div className="main mt-5">{children}</div>
    </div>
  );
}
