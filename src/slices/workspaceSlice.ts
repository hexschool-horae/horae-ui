import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IWorkspaceInitialState {
  workspaceId: string
  membersHashData: string
  workspaceData: IWorkspaceData
}

interface IWorkspaceData {
  viewSet: string
  workspaceName: string
}

const initialState: IWorkspaceInitialState = {
  workspaceId: '',
  membersHashData: '',
  workspaceData: {
    viewSet: '',
    workspaceName: '',
  },
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
    setWorkspaceData: (state, action: PayloadAction<IWorkspaceData>) => {
      state.workspaceData = action.payload
    },
  },
})

export const { setWorkspaceId, setMembersHashData, setWorkspaceData } = workspaceSlice.actions //給React組件個別使用

export default workspaceSlice.reducer //給store.js使用
