import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { closeChat } from "../../../../../../../redux/slices/chat-slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { colors } from "../../../../../../../utils/colorpalatte";
const ChatHeader = () => {
  const dispatch = useDispatch();
  const chatReducer = useSelector((state) => state.chatReducer);

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-10">
      <div className="flex gap-3 items-center justify-between w-full">
        <div className=" flex gap-3 justify-center items-center">
          {chatReducer.selectedChatType === "contact" ? (
            <Avatar
              className=" uppercase flex justify-center items-center  border-[1px] text-lg h-12 w-12  rounded-full overflow-hidden"
              style={{
                backgroundColor:
                  !chatReducer.selectedChatData.image &&
                  colors[chatReducer.selectedChatData.color]?.bg,
              }}
            >
              {/* <AvatarFallback>CN</AvatarFallback> */}
              {chatReducer.selectedChatData.image ? (
                <AvatarImage
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/profiles/${
                    chatReducer.selectedChatData?.image
                  }`}
                  className="object-cover"
                />
              ) : (
                <div
                  className=" flex justify-center items-center"
                  style={{
                    color: "white",
                  }}
                >
                  {chatReducer.selectChatType === "contact" &&
                  chatReducer.selectedChatData.firstName
                    ? chatReducer.selectedChatData.firstName.split("").shift()
                    : chatReducer.selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
          ) : (
            <>
              <div className="bg-[#212121] h-10 w-10 items-center rounded-full flex justify-center">
                <div className="">#</div>
              </div>
            
            </>
          )}
          <div>
            <p className="capitalize">
              {chatReducer.selectedChatType == "contact" ?
               <p className="capitalize">
               {chatReducer.selectedChatData.firstName &&
               chatReducer.selectedChatData.lastName
                 ? `${chatReducer.selectedChatData.firstName} ${chatReducer.selectedChatData.lastName}`
                 : chatReducer.selectedChatData.email}
             </p>
             :
             <p className="capitalize">{ chatReducer.currentChannel.name}</p>
              }
            </p>
          </div>
        </div>

        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <RiCloseFill
            className="text-3xl"
            onClick={() => dispatch(closeChat())}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
