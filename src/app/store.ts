import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from '@/slices/userSlice'
import workspaceReducer from '@/slices/workspaceSlice'

const reducers = combineReducers({
  user: userReducer,
  workspace: workspaceReducer,
})

//預設位置 localstorage。說明：https://github.com/rt2zz/redux-persist
const persistConfig = {
  key: 'app',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, //加了redux-persist，ts下會一直噴警告，先關掉之後再回來看怎麼處理
    }),
})

export type RootState = ReturnType<typeof persistedReducer>
export type AppDispatch = typeof store.dispatch
export default store
