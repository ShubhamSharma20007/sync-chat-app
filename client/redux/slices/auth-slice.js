import { createSlice } from '@reduxjs/toolkit'

const initialState ={
    user:null
}


export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        currentUser:(state,action)=>{
            state.user = action.payload
        }
    }
})

export const {currentUser} = userSlice.actions
export default userSlice.reducer