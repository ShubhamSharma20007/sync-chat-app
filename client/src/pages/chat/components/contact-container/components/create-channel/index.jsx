import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button.jsx";
// import { addChannels } from "../../../../../../../redux/slices/chat-slice";
import { CREATE_CHANNEL, GET_ALL_CONTACTS } from "../../../../../../../utils/constant";
import MultipleSelector from "../../../../../../components/ui/multiselect";
import { toast } from "sonner";
const CreateChannel = () => {
  const [newchannelModal, setnewchannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const dispatch = useDispatch();

  // get all these contacts for channel
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const request = await apiClient.get(GET_ALL_CONTACTS, {
          withCredentials: true,
        });
        const response = await request.data;
        if (response.success) {
          setAllContacts(response.contacts);
        }
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchContacts();
  }, []);




  const handleChannelName = async (channelname) => {
    setChannelName(channelname);
  
  };

  const debouceChannelName = debounce(handleChannelName, 300);

  const createChannel = async() => {
    if(channelName.length >0 && selectedContacts.length >0){
      try {
        const request = await apiClient.post(
          CREATE_CHANNEL,
          {
            name:channelName,
            members:allContacts.map(id=>id.value)
  
          },
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if(response.success){
          toast.success(response.message)
          setChannelName('')
          setSelectedContacts([])
          setnewchannelModal(false)
          // dispatch(addChannels(response.channel))
        }
  
       
      } catch (error) {
       
          console.log(error)
        // console.error(error.response.data.message || error);
       
      
      }

    }
  };

  

  return (
    <>
      <Dialog open={newchannelModal} onOpenChange={setnewchannelModal}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <DialogTrigger>
                <FaPlus
                  className="text-neutral-400 font-light text-opacity-90 text-start hover:text-white transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setnewchannelModal(true);
                  }}
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none outline-none mb-2 p-3 text-white">
              <p>Create New Channel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel
            </DialogTitle>
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
          <div>
            <Input
              onChange={(e) => debouceChannelName(e.target.value)}
              placeholder="Channel Name..."
              
              className="rounded-lg p-5 bg-[#2c233b] border-none"
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white capitalize"
              defaultOptions={allContacts}
              placeholder="Select Contact"
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-900">
                  No result found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              onClick={createChannel}
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            >
              Create Channel
            </Button>
          </div>

         
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
