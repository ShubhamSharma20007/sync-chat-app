import express from "express"
import {
    createChannel,
    getUsersChannel
} from "../controllers/channel_controller.js";
import {auth} from "../middlewares/auth_middleware.js"

const channelRouter = express.Router();

channelRouter.post('/create-channel',auth,createChannel)
channelRouter.get('/get-users-channel',auth,getUsersChannel)


export default channelRouter;
