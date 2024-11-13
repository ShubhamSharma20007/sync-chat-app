import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import apiClient from "../../../../../../../lib/api-client";
import { GET_MESSAGES } from "../../../../../../../utils/constant";
import { HOST } from "../../../../../../../utils/constant";
import {
  addMessage,
  selectedChatMessages,
  setFileDownloadProcess,
  setIsDownloading,
} from "../../../../../../../redux/slices/chat-slice";
import { MdFolderZip } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineDownloadForOffline } from "react-icons/md";

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const chatReducer = useSelector((state) => state.chatReducer);

  const getUser = useSelector((state) => state.authReducer.user);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImgaeUrl] = useState(null);

  const getMessages = async () => {
    try {
      const request = await apiClient.post(
        GET_MESSAGES,
        {
          id: chatReducer.selectedChatData._id,
        },
        {
          withCredentials: true,
        }
      );
      const response = await request.data;
      console.log(response, 12);
      if (response.success) {
        const { messages } = response;
        dispatch(selectedChatMessages(messages));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpeg|jpg|png|gif|webp||svg||ico)$/i;
    return imageRegex.test(filePath);
  };

  useEffect(() => {
    getMessages();
  }, [getUser, chatReducer.selectedChatData, chatReducer.selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [chatReducer.selectedChatMessages]);

  const handleDownloadFile = async (file) => {
    dispatch(setIsDownloading(true));
    dispatch(setFileDownloadProcess(0));
    // show the notification to download file
    Notification.requestPermission().then(async function (permission) {
      if (permission === "granted") {
        const request = await apiClient.get(`${HOST}/download-image/${file}`, {
          responseType: "blob",
          onDownloadProgress:data=>{
            dispatch(setFileDownloadProcess(Math.round(100 * data.loaded / data.total)))
          }
        });
        console.log(request);
        const response = await request.data;
        const url = URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(response);
        new Notification("File Downloaded", {
          body: "File Downloaded Successfully",
          icon: `${HOST}/download-image/${file}`,
        });
        dispatch(setIsDownloading(false));
        dispatch(setFileDownloadProcess(0));
      }
    });
  };




  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === chatReducer.selectedChatData._id
            ? "text-left"
            : "text-right"
        }`}
   
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== chatReducer.selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/50 border-[#ffff]/20 "
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== chatReducer.selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/50 border-[#ffff]/20 "
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setImgaeUrl(message.fileUrl);
                  setShowImage(true);
                }}
              >
                <img
                  className="h-[200px] w-[200px]"
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/files/${
                    message.fileUrl
                  }`}
                />
              </div>
            
            ) : (
              <div
                className="flex justify-center items-center cursor-pointer space-x-3"
                onClick={() => handleDownloadFile(message.fileUrl)}
              >
                <span className="text-white/80 text-3xl  bg-black/20 rounded-full p-3">
                  <MdFolderZip className="text-3xl" />
                </span>
                <span className="text-sm">
                  {message.fileUrl.split("-").pop()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };


  const renderChannelMessage = (message) => {
  //  return console.log({message})
    return(
      <div className={`$ mt-5 ${message.sender._id !== undefined ? 'text-left' :'text-right'}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== chatReducer.selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/50 border-[#ffff]/20 "
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
      </div>
    )
  };


  const renderMessage = () => {

    let lastDate = null;
    return chatReducer.selectedChatMessages.map((msg, index) => {
      const messageDate = moment(msg.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate != lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(msg.createdAt).format("LL")}
            </div>
          )}
          {chatReducer.selectedChatType === "contact" && renderDMMessages(msg)}
          {chatReducer.selectedChatType === "channel" && renderChannelMessage(msg)}
          <div
            className={`${
              msg.sender === getUser._id ? "text-right" : "text-left"
            } text-gray-600 text-xs`}
          >
            {moment(msg.createdAt).format("LT")}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 chat-container overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="h-screen fixed z-50 inset-0 flex justify-center items-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/uploads/files/${imageUrl}`}
              alt=""
              className="h-[60vh] w-full bg-cover"
            />
          </div>
          <div className="flex space-x-8 fixed top-0 mt-5">
            <button
              onClick={() => {
                handleDownloadFile(imageUrl);
              }}
              className="bg-black/20 p-3  rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 "
            >
              <MdOutlineDownloadForOffline className="text-3xl" />
            </button>
            <button
              onClick={() => {
                setImgaeUrl(null);
                setShowImage(false);
              }}
              className="bg-black/20 p-3  rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 "
            >
              <IoCloseCircleOutline className="text-3xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
