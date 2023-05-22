import { Manager } from 'socket.io-client'
const URL = process.env.NEXT_PUBLIC_SOCKET_SERVER || ''
export default new Manager(URL)
