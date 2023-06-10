import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import userReducer from '@/slices/userSlice'
import boardReducer from '@/slices/boardSlice'
import workspaceReducer from '@/slices/workspaceSlice'
import socketServiceReducer from '@/slices/socketServiceSlice'
import errorReducer from '@/slices/errorSlice'
import dialogReducer from '@/slices/dialogSlice'

const reducers = combineReducers({
  user: userReducer,
  board: boardReducer,
  error: errorReducer,
  workspace: workspaceReducer,
  socketService: socketServiceReducer,
  dialog: dialogReducer,
})

const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, //加了redux-persist，ts下會一直噴警告，先關掉之後再回來看怎麼處理
    }),
})

export type RootState = ReturnType<typeof reducers>
export type AppDispatch = typeof store.dispatch
export default store
