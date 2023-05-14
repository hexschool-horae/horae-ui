import { Button } from "primereact/button";

export default function AddCardListButoon() {
  return (
    <Button className="border-secondary-2 text-secondary-3 flex h-16" outlined>
      新增其他列表
      <span className="ml-auto">+</span>
    </Button>
  );
}
