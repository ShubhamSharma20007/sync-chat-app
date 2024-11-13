import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessageContact:[],
    isUploading:false,
    isDownloading:false,
    fileUploadProccess:0,
    fileDownloadProcess:0,
    channels: [],
    currentChannel:undefined
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        selectChatType: (state, action) => {
            state.selectedChatType = action.payload;
        },
        selectedChatData: (state, action) => {
            state.selectedChatData = action.payload;
        },
        selectedChatMessages: (state, action) => {
            state.selectedChatMessages = action.payload;
        },
        directMessageContact: (state, action) => {
            state.directMessageContact = action.payload;
        },
        closeChat: (state) => {
            state.selectedChatType = undefined;
            state.selectedChatData = undefined;
            state.selectedChatMessages = [];
        },
        addMessage: (state, action) => {
            const newMessage = {
                ...action.payload,
                receiver:
                    state.selectedChatType === 'channel'
                        ? action.payload.receiver
                        : action.payload.receiver._id,
                sender:
                    state.selectedChatType === 'channel'
                        ? action.payload.sender
                        : action.payload.sender._id,
            };
            
            // Use immutable array update to add the new message
            state.selectedChatMessages = [...state.selectedChatMessages, newMessage];
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        }
        ,
        setIsDownloading: (state, action) => {
            state.isDownloading = action.payload;
        }
        ,
        setFileUploadProcess: (state, action) => {
            state.fileUploadProccess = action.payload;
        }
        ,
        setFileDownloadProcess: (state, action) => {
            state.fileDownloadProcess = action.payload;
        },
        // addChannels :(state,action)=>{
        //     state.channels = [...state.channels,action.payload]   
        // },
        setcurrentChannel:(state,action)=>{
            state.currentChannel = action.payload
        },
        setChannel:(state,action)=>{
            state.channels = action.payload

        }


        
    },
});

export const { selectChatType, selectedChatData, closeChat, addMessage ,selectedChatMessages,directMessageContact,setIsUploading,setIsDownloading,setFileUploadProcess,setFileDownloadProcess,setChannel,setcurrentChannel} = chatSlice.actions;
export default chatSlice.reducer;
