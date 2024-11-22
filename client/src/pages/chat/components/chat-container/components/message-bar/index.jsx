import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker, { SuggestionMode } from 'emoji-picker-react';
import { useSelector } from "react-redux";
import { useSocket } from "../../../../../../../context/SocketContext";
import apiClient from "../../../../../../../lib/api-client.js"
import {UPLOAD_CHAT_FILE} from "../../../../../../../utils/constant.js"
import { setFileUploadProcess, setIsUploading } from "../../../../../../../redux/slices/chat-slice.js";
import { useDispatch } from "react-redux";
const MessageBar = () => {
  const emojiRef = useRef(null)
  const fileRef =  useRef(null);
  const socket = useSocket()
  const dispatch = useDispatch()
  const emojiButtonRef = useRef(null)
  const [emojiPickerOpen,setEmojiPickerOpen] = useState(false)
  const [msg, setMsg] = useState("");
  const chatReducer = useSelector((state) => state.chatReducer);
  const getUser = useSelector((state) => state.authReducer.user);
  useEffect(()=>{
  const handleOutsideClick =(event)=>{
    if(!emojiButtonRef.current.contains(event.target)  && !emojiRef.current.contains(event.target)){
      setEmojiPickerOpen(false)
    }
  }
  document.addEventListener('click',handleOutsideClick)

  return()=>{
    document.removeEventListener('click',handleOutsideClick)
  }

  },[emojiRef])
  const handleAddEmoji =(emoji)=>{
    setMsg((prev)=>prev+emoji.emoji)
  }

 
  const handleSendMessage = async () => {
    try {
      if (!socket || !socket.connected) {
        console.error("Socket is not connected.");
        return;
      }
      if (chatReducer.selectedChatType === "contact") {
        socket.emit("send-message", {
          sender: getUser._id,
          content: msg,
          receiver: chatReducer.selectedChatData._id,
          messageType: "text",
          fileUrl: undefined,
        });
        
        setMsg("");
      }
      else if(chatReducer.selectedChatType === "channel"){
        socket.emit('send-channel-message', {
          sender: getUser._id,
          content: msg,
          messageType: "text",
          fileUrl: undefined,
          channel_Id: chatReducer.selectedChatData._id
        })
        setMsg("");
      }
    } catch (error) {
      console.log(error);
    }
  };





 


  
  const handleChatfile =()=>{
    fileRef.current.click();

  }

  const handleGetFileOnChange =async()=>{
    const fileName = fileRef.current.files[0];
    // setMsg(prev=>prev+= fileName.name)

    const formData = new FormData();
    formData.append("file", fileName);
    dispatch(setIsUploading(true))
    dispatch(setFileUploadProcess(0))
    try {
      
      const request = await apiClient.post(
        UPLOAD_CHAT_FILE,formData,
        {
          withCredentials:true,
          onUploadProgress:(data)=>{
            dispatch(setFileUploadProcess(Math.round(100* data.loaded / data.total)))
            
          }
        }
      )
      const response = await request.data;
      if(response.success){
        dispatch(setIsUploading(false))
       if(chatReducer.selectedChatType === "contact"){
        socket.emit("send-message", {
          sender: getUser._id,
          content: undefined,
          receiver: chatReducer.selectedChatData._id,
          messageType: "file",
          fileUrl: response.file,
        });
        
       }
       else if(chatReducer.selectedChatType === "channel"){
        socket.emit('send-channel-message', {
          sender: getUser._id,
          content: undefined,
          messageType: "file",
          fileUrl: response.file,
          channel_Id: chatReducer.selectedChatData._id
        })
       
       }

      }
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message)
      dispatch(setIsUploading(false))
    } finally{
      dispatch(setIsUploading(false))
      dispatch(setFileUploadProcess(0))
    }
    
  }
  
  
  
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-1 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-3 ">
        <input
          type="text"
          onChange={(e) => setMsg(e.target.value)}
          name="message"
          id=""
          value={msg}
          className="flex-1 p-3 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message..."
          autoComplete="off"
        />

        <button className="text-neutral-500 focus:border-none  focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" onClick={handleChatfile} />
          <input type="file" name="file" id=" file" ref={fileRef} onChange={handleGetFileOnChange} hidden accept=".pdf, .docx, .png, .jpeg, .jpg, .webp" />
        </button>
        <div className="relative">
          <button  ref={emojiButtonRef} className="text-neutral-500 pr-2 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiEmojiStickerLine className="text-2xl" 
        
            onClick={()=>{
              setEmojiPickerOpen(!emojiPickerOpen)
            }}
            />
          </button>

          <div className="absolute bottom-16 right-0" ref={emojiRef}>
          <EmojiPicker open={emojiPickerOpen} theme="light"  height={300} autoFocusSearch={false}  width={280} onEmojiClick={handleAddEmoji}/>
          </div>
        </div>
      </div>

      <button onClick={()=>handleSendMessage()} className="text-white/90 rounded-md bg-[#8417ff] hover:bg-[#741bda] flex items-center justify-center p-3 focus:bg-[#741bda]  focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
        <IoSend className="text-2xl"  />
      </button>
    </div>
  );
};

export default MessageBar;
