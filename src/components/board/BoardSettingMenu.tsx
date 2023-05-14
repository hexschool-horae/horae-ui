import { useState, useRef, MouseEvent } from "react";

import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";

export default function SettingMenu() {
  const menu = useRef<Menu>(null);
  const items: MenuItem[] = [
    {
      label: "Options",
      items: [
        {
          label: "Update",
          icon: "pi pi-refresh",
        },
      ],
    },
  ];

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (menu.current === null) return;
    menu.current.toggle(event);
  };

  return (
    <>
      <Menu model={items} popup ref={menu} />
      <Button className="text-secondary-3 p-0 leading-none" icon="pi pi-ellipsis-v" text aria-label="MenuToggle" onClick={handleMenuToggle} />
    </>
  );
}
