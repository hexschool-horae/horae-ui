import { ReactNode } from "react";
import Header from "@/components/common/Header";

export default function DefaultLayout({ children }: { children?: ReactNode }) {
  return (
    <>
      <Header />
      <div className="main mt-5 container mx-auto">{children}</div>
    </>
  );
}
