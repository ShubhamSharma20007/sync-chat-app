import React from "react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { animationDefaultOption } from "../../../../../../../lib/utils";
import Lottie from "react-lottie";
import { debounce } from "../../../../../../../utils/debouce";
import apiClient from "../../../../../../../lib/api-client";
import { USER_SEARCH } from "../../../../../../../utils/constant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors } from "../../../../../../../utils/colorpalatte";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChatType,
  selectedChatData,
} from "../../../../../../../redux/slices/chat-slice";
const NewDM = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchContact, setSearchContact] = useState("");
  const [searchUserData, setsearchUserData] = useState([]);
  const [iserror,setIserror] = useState(false)
  const dispatch = useDispatch();

  const handleSearchUser = async (searchTerm) => {
    if (searchTerm != "" && searchTerm.length > 0) {
      setSearchContact(searchTerm);
      try {
        const request = await apiClient.post(USER_SEARCH, {
          searchTerm,
        },{
          withCredentials:true
        });
        const response = await request.data;
       
        setIserror(false)
        if (response.success) {
          setsearchUserData(response.contacts);
        } 
      } catch (error) {
        console.error(error.response.data.message);
        setIserror(true)
        setsearchUserData([])
      }
    } else {
      setSearchContact("");
      setsearchUserData([])
      setIserror(false)
    }
  };


  const debouceSearchUser = debounce(handleSearchUser, 300);

  const selectNewContact = (contact) => {
    dispatch(selectChatType("contact"));
    dispatch(selectedChatData(contact));
    setsearchUserData([]);
    setOpenDialog(false);
    setSearchContact("");
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <DialogTrigger>
                <FaPlus
                  className="text-neutral-400 font-light text-opacity-90 text-start hover:text-white transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none outline-none mb-2 p-3 text-white">
              <p>Select New Contact</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
          <div>
            <Input
              onChange={(e) => debouceSearchUser(e.target.value)}
              placeholder="Search Contact..."
              className="rounded-lg p-5 bg-[#2c233b] border-none"
            />
          </div>

          {searchContact.length <= 0 ? (
            <div className="flex-1  md:flex border flex-col justify-center items-center border-none  duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled
                height={100}
                width={100}
                options={animationDefaultOption}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-4 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500"> !</span> Seach
                  <span className="text-purple-500"> Contact </span>.
                </h3>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[250px] rounded-md ">
              <div className="flex flex-col gap-1 ">
                {searchUserData && searchUserData.length > 0 && (
                  searchUserData.map((contacts, idx) => (
                    <div
                      onClick={() => selectNewContact(contacts)}
                      key={idx}
                      className="flex gap-3 items-center cursor-pointer transition-all duration-300   hover:bg-purple-700 px-2 py-3 rounded-lg"
                    >
                      <div className="w-12 h-12 relative">
                        <Avatar
                          className=" uppercase flex justify-center items-center  border-[1px] text-lg h-12 w-12  rounded-full overflow-hidden"
                          style={{
                            backgroundColor:
                              !contacts.image && colors[contacts.color]?.bg,
                          }}
                        >
                          {/* <AvatarFallback>CN</AvatarFallback> */}
                          {contacts.image ? (
                            <AvatarImage
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/profiles/${contacts?.image}`}
                              className="object-cover"
                            />
                          ) : (
                            <div
                              className=" flex justify-center items-center"
                              style={{
                                color: "white",
                              }}
                            >
                              {contacts.firstName
                                ? contacts.firstName.split("").shift()
                                : contacts.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div>
                        <p className="capitalize">
                          {contacts.firstName && contacts.lastName
                            ? `${contacts.firstName} ${contacts.lastName}`
                            : ""}
                        </p>
                        <p className="text-xs">{contacts.email}</p>
                      </div>
                    </div>
                  ))
                )}

                {
                  iserror && (
                    
                      <p className="text-center capitalize text-lg">
                        {" "}
                        No user found
                      </p>
                    

                  )
                }
                
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
