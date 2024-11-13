import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FiPlus } from "react-icons/fi";
import { FaPlus, FaTrash } from "react-icons/fa";
import { colors } from "../../../utils/colorpalatte";
import { toast } from "sonner";
import apiClient from "../../../lib/api-client";
import { ADD_PROFILE_ROUTE, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE_ROUTE } from "../../../utils/constant";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { currentUser } from "../../../redux/slices/auth-slice";
const Profile = () => {
  const navigate =  useNavigate()
  const dispatch = useDispatch()
  const getUser = useSelector((state) => state.authReducer.user);
  console.log(getUser);
  
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const InputFileRef = useRef(null)




  useEffect(()=>{
    if(getUser.profileSetup){
      setFirstName(getUser.firstName);
      setLastName(getUser.lastName);
    }
    if(getUser.image){
      setImage(getUser.image)
    }
  },[getUser,navigate])
  


const validateProfile =()=>{
  console.log(firstName,lastName,selectedColor);
  if(!firstName){
    toast.error('First Name is required !')
    return;
  }
  if(!lastName){
    toast.error('Last Name is required !')
    return;
  }
  return true
}



  const saveChange =async ()=>{
    if(validateProfile()){
    try {
      const request =  await apiClient.post(UPDATE_PROFILE_ROUTE,{
        firstName,
        lastName,
        color:selectedColor 
      },{
         withCredentials:true
       })
       const response = await request.data;
       if(response.success){
         toast.success(response.message);
         // reset the fields
         setFirstName('');
         setLastName('');
         setSelectedColor(0);
         dispatch(currentUser({ ...getUser, firstName,lastName,color:selectedColor}));
         navigate('/chat')
       }
       
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
    }
  }

  const handleNavigate =e=>{
    if(getUser.profileSetup){
      navigate('/chat')
    }
    else{
      toast.error('Please setup profile')
    }
    
  }

  useEffect(() => {
    if (!image && colors[selectedColor]) {
      document.querySelector('.avatar-background').style.backgroundColor = colors[selectedColor].bg;
    }
  }, [selectedColor, image]);

  const handleFileInputClick =(e)=>{
    InputFileRef.current.click()
    
  }

  const handleImageChange = async () => {
    const targetImage = InputFileRef.current.files[0];
    if (targetImage) {
      console.log(targetImage.name);
      const formData = new FormData();
      formData.append('avatar', targetImage); 
  
      try {
        const request = await apiClient.post(ADD_PROFILE_ROUTE, formData, {
          withCredentials: true
        });
  
        const response = await request.data;
        if (response.success) {
          toast.success(response.message);
          dispatch(currentUser({ ...getUser, image: response?.updatedUser?.image }));
          navigate('/chat')
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };


  
  const handleDeleteImage = async(e)=>{
    try {
      const request = await apiClient.get(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });

      const response = await request.data;
      if (response.success) {
        toast.success(response.message);
        dispatch(currentUser({ ...getUser, image: null }));
        setImage(null);
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    }
  }


  
  return (
    <div className="bg-[#1b1c24] flex h-screen  items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max border p-4 rounded-lg border-white/20 shadow-lg ">
        <div>
          <IoMdArrowBack onClick={handleNavigate} className="text-white text-2xl lg:text-4xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="relative">
              <Avatar
                className=" avatar-background uppercase flex justify-center shadow-sm shadow-white items-center  border-[1px] text-5xl h-32 w-32 md:w-42 md:h-42 rounded-full overflow-hidden "
                style={{
                  backgroundColor: image ? 'transparent' : colors[selectedColor]?.bg,
                }}
              >
                {/* <AvatarFallback>CN</AvatarFallback> */}
                {image ? (
                  <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}/uploads/profiles/${image}`} className="object-cover object-center" />
                ) : (
                  <div
                    className=" flex justify-center items-center"
                    style={{
                      color: "white",
                    }}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : getUser.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                onClick={ image ? handleDeleteImage:handleFileInputClick}
                  className={`absolute  inset-0  flex items-center justify-center bg-black/50 ring-2 ring-white/90 rounded-full z-10`}
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FiPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
              <input type="file" ref={InputFileRef} hidden name="avatar" onChange={handleImageChange}  accept=".png, .jpeg, .jpg, .svg, .webp"/>
            </div>
          </div>
          <div className="flex min-w-32  md:min-w-64 gap-5 text-white items-center justify-center flex-col ">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={getUser.email}
                className="rounded-lg p-4 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-4 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
            
                className="rounded-lg p-4 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((clr, idx) => (
                <div
                  style={{
                    backgroundColor: clr?.bg,
                  }}
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  className={` h-8 w-8 rounded-full cursor-pointer transition-all duration-100
                    ${
                      
                      selectedColor== idx
                        ? "outline outlinde-white/50 outline-3 shadow-md"
                        : ""
                    }
                    
                    `}
                ></div>
              ))}
            </div>
          </div>
        </div>
         <div className="w-full">
         <Button
         onClick={()=>saveChange()}
         className="bg-purple-700 w-full hover:bg-purple-600">Button</Button>
         </div>
     
      </div>
    </div>
  );
};

export default Profile;
