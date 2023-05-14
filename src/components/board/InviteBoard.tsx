import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

export default function InviteBoard() {
	const [visible, setVisible] = useState<boolean>(true);

	return (
		<div className="card flex justify-content-center">
			{/* <Button
				label="Show"
				icon="pi pi-external-link"
				onClick={() => setVisible(true)}
			/> */}
			<Dialog
				header={
					<div className="text-2xl text-secondary-1">邀請成員加入看板</div>
				}
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => setVisible(false)}
			>
				<div className="m-0">
					<InputText />
				</div>
			</Dialog>
		</div>
	);
}
