import { useRouter } from "next/router";
import { Button } from "primereact/button";

export default function Header() {
  const router = useRouter();

  return (
    <div className="w-full flex items-center p-5">
      <div className="nav-brand text-2xl">Horae</div>

      <div className="ml-auto">
        <Button className="text-red-600" label="登入" link />
        <Button
          className=" bg-red-600"
          label="立即免費註冊"
          rounded
          onClick={() => router.push("/register")}
        />
      </div>
    </div>
  );
}
