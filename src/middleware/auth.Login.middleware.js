import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth_IsloginMiddleWareController = async (req, res, next) => {

    try {
        const userToken = req.cookies?.JwtToken;
        console.log("User token inside cookie :", userToken);

        if (!userToken) {
            console.log('No token found');
            res.status(401).json({
                success: false,
                message: 'Unauthorized access - token is missing',
            })
        }
        console.log("before Decoded token ");
        const decodedToken = jwt.verify(userToken, process.env.JWT_SECRETKEY);
        console.log("after decoded token");
        
        console.log("Decoded token :", decodedToken);
        req.user = decodedToken;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'authentication error occured'
        })
    }
}