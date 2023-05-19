import { ReactNode } from "react";
import { io } from "socket.io-client";

export default function WebSocketWrapper({
	children,
}: {
	children: ReactNode;
}) {
	const socket = io();
	return children;
}
