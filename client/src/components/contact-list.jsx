import React from "react";
import { useSelector } from "react-redux";
import {
  selectChatType,
  selectedChatData,
  selectedChatMessages,
  setcurrentChannel,
} from "../../redux/slices/chat-slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { HOST } from "../../utils/constant";
import { colors } from "../../utils/colorpalatte";
const ContactList = ({ contacts, isChannel = false }) => {
  const chatReducer = useSelector((state) => state.chatReducer);
  const dispatch = useDispatch();

  const handleClick = (contact) => {
    if (isChannel) {
      dispatch(selectChatType("channel"));
      dispatch(setcurrentChannel(contact))
    } else {
      dispatch(selectChatType("contact"));
    }
    dispatch(selectedChatData(contact));

    if (
      chatReducer.selectedChatData &&
      chatReducer.selectedChatData._id != contact._id
    ) {
      dispatch(selectedChatMessages([]));
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact,idx) => {

        return (
          <div
            key={contact._id}
            className={`capitalize ${chatReducer.selectedChatData && chatReducer.selectedChatData._id === contact._id ?'bg-[#741bda] ' :'bg-transparent'}  pl-10 py-2 transition-all duration-300 cursor-pointer ${
                chatReducer.selectedChatData && chatReducer.selectedChatData._id === contact._id
                ? " hover:bg-[#741bda]"
                : "hover:bg-[#f1f1f143]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              {!isChannel && (
                <>
                  <Avatar
                    className=" uppercase flex justify-center items-center  border-[1px] text-lg h-10 w-10  rounded-full overflow-hidden"
                    style={{
                      backgroundColor:
                      chatReducer.selectedChatData && chatReducer.selectedChatData._id === contact._id ? 'transparent' : !contact.image && colors[contact.color]?.bg,
                        
                    }}
                  >
                    {/* <AvatarFallback>CN</AvatarFallback> */}
                    {contact.image ? (
                      <AvatarImage
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/uploads/profiles/${contact?.image}`}
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className=" flex justify-center items-center"
                        style={{
                          color: "white",
                        }}
                      >
                        {contact === "contact" && contact.firstName
                          ? contact.firstName.split("").shift()
                          : contact.email.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                  </>
                )}
            {isChannel && (
              <div className="bg-[#212121] h-10 w-10 items-center rounded-full flex justify-center">
                <div className="">#</div>
              </div>
            )}
            <span className="text-white">
              {isChannel ? contact.name : `${contact.firstName} ${contact.lastName}`}
            </span>
                
            
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
