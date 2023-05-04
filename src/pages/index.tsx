import { useRouter } from "next/router";

import { Button } from "primereact/button";

export default function Index() {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">歡迎！</h2>

      <Button
        className="p-0"
        label="前往個人頁面"
        onClick={() => router.push("/profile")}
        link
      />
    </div>
  );
}
