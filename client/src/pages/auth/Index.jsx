import React, { useEffect, useState } from "react";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LOGIN_ROUTE, SINGUP_ROUTE } from "../../../utils/constant";
import apiClient from "../../../lib/api-client";
import LoginPNG from "../../assets/login2.png"
import {useNavigate} from  "react-router-dom"
import { useDispatch } from "react-redux";
import { currentUser } from "../../../redux/slices/auth-slice";
const Auth = () => {
  const navigate = useNavigate()
  const dispatch =  useDispatch()
// signup field's
  const [values,setValues] = useState({
    email: "",
    password: "",
    conPassword:''

  })
  // login field's

  const [field,setField] =useState({
    email: "",
    password: "",
  })



  const validateSingup = ()=>{
    const {email,password,conPassword} = values;
    if(!email.length){
      toast.error('Invalid email')
      return
    }
    if(!password.length){
      toast.error('Invalid password')
      return
    }
    if(password != conPassword){
      toast.error('Passwords do not match');
      return
    }
    if(password.length < 6){
      toast.error('Password must be at least 6 characters');
      return;
    }
    return true

  }


  const validateLogin = ()=>{
    const {email,password} = field;
    if(!email.length){
      toast.error('Invalid email')
      return
    }
    if(!password.length){
      toast.error('Invalid password')
      return
    }
    if(password.length < 6){
      toast.error('Password must be at least 6 characters');
      return;
    }
    return true
  }

 
  const handleLogin = async()=>{
  
    if(validateLogin()){
      try {
        const request = await apiClient.post(LOGIN_ROUTE,{
          email:field.email,
          password:field.password
        },{
          withCredentials:true // it's help  to set token direct in the cookie 
        })
        const response =  await request.data;
        const {user} = response.user
      
        
        if(response.success){
          toast.success(response.message,{
              classNames: {
      
        actionButton: "float-right",
      },
          })
          dispatch(currentUser(user))
          if(user._id){
            if(user.profileSetup){
              setTimeout(() => {
                navigate('/chat')
              }, 500);
            }
            else{
              setTimeout(() => {
                navigate('/profile')
              }, 500);
            }
          }
         
        }
      } catch (error) {
        toast.error(error?.response?.data?.message)
      }
    }
  }
  const handleSignup = async()=>{
    if(validateSingup()){
      try {
        const request = await apiClient.post(SINGUP_ROUTE,{
          email:values.email,
          password:values.password
        },{
          withCredentials:true // it's help  to set token direct in the cookie 
        })
        const response =  await request.data;

        if(response.success){
          toast.success(response.message,{
           
          })
          dispatch(currentUser(response.user.user))
          setTimeout(() => {
            navigate('/profile')
          },500)

        }
      } catch (error) {
        toast.error(error?.response?.data?.message)
      }
    }
    
  }
  return (
    <div>
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden">
        <div className="h-[80vh]  shadow-2xl  text-opacity-90 w-[80vw] lg:w-[70vw] xl:w-[60vw] rounded-xl grid xl:grid-cols-2">
          <div className="flex flex-col gap-10 items-center justify-center  p-3 md:p-0">
            <div className="flex items-center justify-center flex-col">
              <div className="flex justify-center items-center">
                <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                <img src={Victory} alt="victory image" className="h-[100px]" />
              </div>
              <p className="font-medium text-center mb-2">
                Fill in the details to get started with  chat app!
              </p>
              <div className="flex items-center justify-center w-full ">
                <Tabs defaultValue="login" className="flex justify-center w-full flex-col items-center  "  >
                  <TabsList className="  shadow-none w-full">
                    <TabsTrigger value="login"  className="w-1/2">login</TabsTrigger>
                    <TabsTrigger value="signup"  className="w-1/2">Signup</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="w-full  flex flex-col gap-3 mt-6">
                  <Input className="w-full focus:outline-none
                   rounded-full p-4 outline-none"
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={(e)=>{
                    setField({...field,email:e.target.value})
                  }}
                  />

                  
                <Input className="w-full focus:outline-none
                   rounded-full p-4 outline-none"
                  placeholder="Password"
                  type="password"
                  name="password"
                  onChange={(e)=>{
                    setField({...field,password:e.target.value})
                  }}
                  />
                       <Button   varriant="outline" onClick={()=>{
                    handleLogin()
                  }} variant="outline" className="rounded-full p-3 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white">Login</Button>
                  </TabsContent>
                  <TabsContent value="signup" className="w-full  flex flex-col gap-3 mt-0">

                  <Input className="w-full focus:outline-none
                   rounded-full p-4 outline-none"
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={(e)=>{
                    setValues({...values,email:e.target.value})
                  }}
                  />

                  
                <Input className="w-full focus:outline-none
                   rounded-full p-4 outline-none"
                  placeholder="Password"
                  type="password"
                  name="password"
                  onChange={(e)=>{
                    setValues({...values,password:e.target.value})
                  }}
                  />
                  
                  <Input className="w-full focus:outline-none
                   rounded-full p-4 outline-none"
                  placeholder="Con-Password"
                  type="text"
                  name="con-password"
                  onChange={(e)=>{
                    setValues({...values,conPassword:e.target.value})
                  }}
                  />
                  
                  <Button   varriant="outline" onClick={()=>{
                    handleSignup()
                  }} variant="outline" className="rounded-full p-3 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white">Singup</Button>

                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex h-full  w-full  justify-center items-center">
          <img src={LoginPNG}  alt="" srcset="" className="h-3/4 w-4/4 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
