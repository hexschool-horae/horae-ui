import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IWorkspaceInitialState {
  workspaceId: string
  membersHashData: string
  viewSet: string
}

const initialState: IWorkspaceInitialState = {
  workspaceId: '',
  membersHashData: '',
  viewSet: '',
}

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaceId: (state, action: PayloadAction<string>) => {
      state.workspaceId = action.payload
    },
    setMembersHashData: (state, action: PayloadAction<string>) => {
      state.membersHashData = action.payload
    },
    setViewSet: (state, action: PayloadAction<string>) => {
      state.viewSet = action.payload
    },
  },
})

export const { setWorkspaceId, setMembersHashData, setViewSet } = workspaceSlice.actions //給React組件個別使用

export default workspaceSlice.reducer //給store.js使用
