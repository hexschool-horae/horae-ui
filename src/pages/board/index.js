import { useRouter } from "next/router";
import Head from "next/head";

import { Button } from "primereact/button";

export default function Board() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Horae - 看板列表</title>
      </Head>

      <h2 className="text-2xl font-bold mb-6">歡迎！</h2>

      <Button
        className="p-0"
        label="前往個人頁面"
        onClick={() => router.push("/profile")}
        link
      />
    </>
  );
}
