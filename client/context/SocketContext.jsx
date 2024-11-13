import { createContext, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { HOST } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addMessage } from "../redux/slices/chat-slice";
import { useCallback } from "react";
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  var socket = useRef(null);
  const getUser = useSelector((state) => state.authReducer.user);
  const chatReducer = useSelector((state) => state.chatReducer); // Always use latest chatReducer state
  const dispatch = useDispatch();

  const handleRecevierMessage = (msg) => {
 
    if (
      chatReducer.selectedChatType &&
      (chatReducer.selectedChatData._id === msg.sender._id ||
        chatReducer.selectedChatData._id === msg.receiver._id)
    ) {
      dispatch(addMessage(msg));
    }
  };

  const handleReceiverChannelMessage=(msg)=>{
    console.log({msg})
  if(chatReducer.selectedChatType != undefined && chatReducer.selectedChatData._id == msg.channelId){
    dispatch(addMessage(msg))
  }
  }

  useEffect(() => {
    if (getUser !== null) {
        socket.current = io(HOST, {
            withCredentials: true,
            query: { userId: getUser._id },
        });

        socket.current.on("connect", () => {
            console.log("Socket connected to server! 👾");
        });

        // Re-attach the message handler to reflect updated chat state
        socket.current.on("receive-message", (msg)=>{
          handleRecevierMessage(msg)
        });

        socket.current.on('receive-channel-message',(msg)=>{
          handleReceiverChannelMessage(msg)
        })

        return () => {
            socket.current.off("receive-message", handleRecevierMessage);
            socket.current.off('receive-channel-message',handleReceiverChannelMessage)

        };
    }
}, [getUser, chatReducer, handleRecevierMessage]);



  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
