//  Auth
export const HOST=  import.meta.env.VITE_BACKEND_URL;
export const AUTH_ROUTE = '/api/auth';
export const SINGUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`
export const ADD_PROFILE_ROUTE = `${AUTH_ROUTE}/add-profile-image`
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTE}/remove-profile-image`
export const LOGOUT = `${AUTH_ROUTE}/logout`



//  Contact
export const CONTACT_ROUTE = '/api/contact';
export const USER_SEARCH  =`${CONTACT_ROUTE}/search-contact`
export const GET_CONTACTS_FOR_DM  =`${CONTACT_ROUTE}/get-contacts-for-dm`
export const GET_ALL_CONTACTS  =`${CONTACT_ROUTE}/get-all-contacts`



//  Messages
export const MESSAGE_ROUTE = '/api/messages';
export const GET_MESSAGES = `${MESSAGE_ROUTE}/get-messages`;
export const UPLOAD_CHAT_FILE = `${MESSAGE_ROUTE}/upload-chat-file`;


// Channel
export const CHANNEL_ROUTE = '/api/channel';
export const CREATE_CHANNEL = `${CHANNEL_ROUTE}/create-channel`
export const GET_USERS_CHANNEL = `${CHANNEL_ROUTE}/get-users-channel`
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTE}/get-channel-messages`





