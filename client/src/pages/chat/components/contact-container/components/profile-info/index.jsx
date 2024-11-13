import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../../../../../../utils/colorpalatte";
import { HiPencilSquare } from "react-icons/hi2";
import apiClient from "../../../../../../../lib/api-client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navigate, useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa6";
import { LOGOUT } from "../../../../../../../utils/constant";
import { toast } from "sonner";
import { currentUser } from "../../../../../../../redux/slices/auth-slice";
const ProfileInfo = () => {
    const navigate = useNavigate()
  const getUser = useSelector((state) => state.authReducer.user);
  const dispatch = useDispatch()


  const handleLogout =async()=>{
    
    try {
        const request = await apiClient.get(LOGOUT,{
            withCredentials:true
        })
        const response = await request.data;
        console.log(response)
        if(response.success){
            toast.success(response.message)
            dispatch(currentUser(null))
            navigate('/auth')

        }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="absolute bottom-0 h-16 justify-between flex items-center px-4 py-6  w-full bg-[#2a2b33]">
      <div className="flex gap-3 justify-between items-center">
        <div className="w-12 h-12 relative">
          <Avatar
            className=" uppercase flex justify-center items-center  border-[1px] text-lg h-12 w-12  rounded-full overflow-hidden"
            style={{
                backgroundColor: !getUser.image && colors[getUser.color]?.bg,
            }}
          >
            {/* <AvatarFallback>CN</AvatarFallback> */}
            {getUser.image ? (
              <AvatarImage
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/profiles/${
                  getUser?.image
                }`}
                className="object-cover  "
              />
            ) : (
              <div
                className=" flex justify-center items-center"
                style={{
                  color: "white",
                }}
              >
                {getUser.firstName
                  ? getUser.firstName.split("").shift()
                  : getUser.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <span className="capitalize">{getUser.firstName && getUser.lastName
          ? `${getUser.firstName} ${getUser.lastName}`
          : ""}</span>
      </div>
      <div className="flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
            <HiPencilSquare   onClick={()=>navigate('/profile')} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white hover:scale-110  duration-300 transition-all text-xl" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] text-white border-none outline-none">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
            <FaPowerOff onClick={handleLogout} className="text-red-500 focus:border-none focus:outline-none focus:text-white hover:scale-110  duration-300 transition-all text-lg" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] text-white border-none outline-none">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
