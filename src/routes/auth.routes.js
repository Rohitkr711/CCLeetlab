import express from "express";
import { userRegisterController } from "../controllers/auth.controllers.js";


const UserAuthRoutes = express.Router();
UserAuthRoutes.get('/',(req,res)=>{    
    res.send('Auth route is working fine')
})
UserAuthRoutes.post('/register',userRegisterController);
// UserAuthRoutes.post('/login');
// UserAuthRoutes.post('/check');
// UserAuthRoutes.post('/logout');

export default UserAuthRoutes;