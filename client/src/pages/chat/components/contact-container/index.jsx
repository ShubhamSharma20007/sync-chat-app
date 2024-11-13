import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info';
import NewDM from './components/new-dm';
import apiClient from '../../../../../lib/api-client';
import { GET_CONTACTS_FOR_DM, GET_USERS_CHANNEL } from '../../../../../utils/constant';
import { useSelector } from 'react-redux';
import {directMessageContact, setChannel} from "../../../../../redux/slices/chat-slice"
import { useDispatch } from 'react-redux';
import ContactList from '../../../../components/contact-list';
import { GET_ALL_CONTACTS } from '../../../../../utils/constant';
import CreateChannel from './components/create-channel';
const ContainerContainer = () => {
  const dispatch = useDispatch();
  const chatSelector = useSelector((state) => state.chatReducer);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await apiClient.get(
          GET_CONTACTS_FOR_DM,
          
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        
        if(response.success){
          dispatch(directMessageContact(response.contacts))
        }
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
    
      }
    };

    // GET CHANNELS
    const fetchChannels = async () => {
      try {
        const request = await apiClient.get(
          GET_USERS_CHANNEL,
          {
            withCredentials: true,
          }
        );
        const response = await request.data;
        if(response.success){
          dispatch(setChannel(response.channels))
        }
      } catch (error) {
        console.error(error);
    
      }
    };

    fetchData(); 
    fetchChannels()
  }, [chatSelector.setChannel]); 


 
  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className="mt-3">
      <Logo/>
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text={'Direct Message'}/>
          <NewDM/>
        </div>
        {
          <div className="max-[38vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={chatSelector.directMessageContact}/>
          </div>
        }
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text={'Channels'}/>
          <CreateChannel/>
        </div>
        <div className="max-[38vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={chatSelector.channels} isChannel={true}/>
          </div>
      </div>
      <ProfileInfo/>
    </div>
  )
}


export default ContainerContainer


const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Syncronus</span>
    </div>
  );
};


const Title =({text})=>{
  return(
    <h6 className='uppercase tracking-widest text-neutral-300 pl-10 font-light text-opacity-90 text-sm'>{text}</h6>
  )
}