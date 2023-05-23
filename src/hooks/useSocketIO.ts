import { Manager } from 'socket.io-client'
const URL = process.env.NEXT_PUBLIC_SOCKET_SERVER || ''
import store from '@/app/store'
const token = store.getState()?.user?.token
export default new Manager(URL, {
  extraHeaders: {
    token: `Bearer ${token}`,
  },
})
