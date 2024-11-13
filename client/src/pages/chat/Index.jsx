import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ContainerContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const chatSelector = useSelector((state) => state.chatReducer);
  const navigate = useNavigate();
  // useEffect(()=>{
  //   if(!currentUser?.profileSetup){
  //     toast.error('Please setup profile to continue.')
  //     navigate('/profile')
  //   }
  // },[currentUser,navigate])
  return (
    <div className=" flex h-[100vh] text-white overflow-hidden ">
      {
        chatSelector.isUploading &&(
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
            <h5 className="text-5xl animate-pulse">Uploading File</h5>
            {chatSelector.fileUploadProccess}%
          </div>
        )
      }
      {
        chatSelector.isDownloading &&(
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
            <h5 className="text-5xl animate-pulse">Uploading File</h5>
            {chatSelector.fileDownloadProcess}%
          </div>
        )
      }
      <ContainerContainer />
      {chatSelector.selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
