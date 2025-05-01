import bcrypt from "bcryptjs";
import crypto from "crypto";
import { mailSend } from "../Utils/email.service.js";
import { db } from "../libs/db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const userRegisterController = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({
            success: false,
            message: "All fields are required"
        })
    }

    try {
        const userExist = await db.user.findUnique({
            where: { email }
        })
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: 'user already exist',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const registration_VerificationToken = crypto.randomBytes(16).toString('hex');
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                verificationToken: registration_VerificationToken
            }
        })
        if (!newUser) {
            return res.status(422).json({
                success: false,
                message: "Failed to register new user, Try again!"
            })
        }

        // console.log("Mail service started");

        const mailSendInfo = await mailSend(registration_VerificationToken, newUser);
        // console.log("Mail send info", mailSendInfo);

        if (!mailSendInfo.messageId) {
            return res.status(400).json({
                success: true,
                message: "New user got registered but, failed to send mail!",
            })
        }

        // console.log("Mail sent successfully");

        res.status(201).json({
            message: "Mail sent successfully, New user got registered",
            success: true,
            MailSentFrom: mailSendInfo.envelope.from,
            MailSentTo: `${mailSendInfo.envelope.to[0]}`,

        });

    } catch (error) {
        // console.log("Error occured: ", error);
        return res.status(500).json({
            success: false,
            message: 'unexpected error occured.'
        })
    }
}

export const userVerificationController = async (req, res) => {
    console.log("Inside verification controller");

    const { userVerificationToken } = req.params;

    if (!userVerificationToken) {
        return res.status(401).json({
            success: false,
            message: "Token is missing.. use your link correctly"
        })
    }
    // console.log("got the token");

    try {
        const userFound = await db.User.findFirst({
            where: { verificationToken: userVerificationToken }
        })
        if (!userFound) {
            res.status(401).json({
                success: true,
                message: "Unauthorized access"
            })
        }
        // console.log("user found");

        const updateResponse = await db.User.update({
            where: { email: userFound.email },
            data: {
                isVerify: true,
                verificationToken: '',
            }
        })

        if (!updateResponse) {
            return res.send('Unexpected error.. try again!')
        }
        // console.log("updation done in db");


        res.status(201).json({
            success: true,
            message: "user successfully verified"
        })

    } catch (error) {
        console.log("error during verification", error);
        res.status(500).json({
            success: false,
            message: "Unexpected error occured",
            Error: error
        })
    }
}

export const userLoginController = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Missing email or password");
        res.status(401).json({
            success: false,
            message: "All fields are required"
        })
    }

    console.log("got user data");

    try {
        const userExist = await db.user.findUnique({
            where: { email }
        })
        if (!userExist) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        console.log("email is correct");
        console.log("password comparision started");
        const isMatched = await bcrypt.compare(password, userExist.password);
        console.log("password comparision done");

        if (!isMatched) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        console.log("password is correct");


        if (!userExist.isVerify) {
            return res.status(401).json({
                message: "User isn't verified"
            })
        }
        console.log("user is verified");


        const token = jwt.sign(
            { id: userExist.id },
            process.env.JWT_SECRETKEY,
            { expiresIn: "1d" }
        )
        console.log("Jwt token created");


        const tokenCookieOptions={
            httponly: true,
            samesite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 2
        }
        res.cookie("JwtToken", token,tokenCookieOptions)
        console.log("token sent as cookies");


        res.status(201).json({
            success: true,
            message: "User loggedIn successfully",
            user: {
                id: userExist.id,
                email: userExist.email,
                name: userExist.name,
                role: userExist.role,
                image: userExist.image
            }
        })

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed!"
        })
    }

}

export const userCheckProfileController = async (req, res) => {

    try {
        const userId = req.user.id;

        const userExist = await db.user.findUnique({
            where: { id: userId }
        })

        if (!userExist) {
            res.status(401).json({
                success: false,
                message: 'Profile not found'
            })
        }
        console.log("User data", userExist);

        res.status(201).json({
            success: true,
            message: 'user got the profile!'
        })


    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error occured'
        })

    }
}

export const userLogoutController = async (req, res) => {
    try {
        const userId = req.user.id;
        const userExist = await db.user.findUnique({
            where: { id: userId }
        })

        if (!userExist) {
            res.status(401).json({
                success: false,
                message: 'Profile not found'
            })
        }
        console.log("User data", userExist);

        const tokenCookieOptions={
            httponly: true,
            samesite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 2
        }

        res.clearCookie('JwtToken',tokenCookieOptions);
        res.status(201).json({
            success:true,
            message:"User logut successfully"
        })
        

    } catch (error) {
      console.log("Error:",error);
      res.status(500).json({
        success:false,
        message:"Unexpected logout error"
      })

    }

}