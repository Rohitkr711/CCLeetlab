import express from "express";
import { userCheckProfileController, userLoginController, userLogoutController, userRegisterController, userVerificationController } from "../controllers/auth.controllers.js";
import { auth_IsloginMiddleWareController } from "../middleware/auth.Login.middleware.js";


const UserAuthRoutes = express.Router();
UserAuthRoutes.get('/',(req,res)=>{    
    res.send('Auth route is working fine')
})
UserAuthRoutes.post('/register',userRegisterController);
UserAuthRoutes.get('/verify/:userVerificationToken',userVerificationController)
UserAuthRoutes.post('/login', userLoginController);
UserAuthRoutes.get('/checkMe',auth_IsloginMiddleWareController,userCheckProfileController);
UserAuthRoutes.get('/logout',auth_IsloginMiddleWareController,userLogoutController);

export default UserAuthRoutes;