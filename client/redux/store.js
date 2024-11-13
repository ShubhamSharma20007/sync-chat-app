import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/auth-slice"
import chatReducer from "./slices/chat-slice"
export const store = configureStore({
    reducer:{
        authReducer,
        chatReducer
    }
})