import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";

export const userRegisterController = async (req, res) => {
    // console.log('Register controller is working');
    // res.send('Registration controller is running up 🙌')

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({
            success: false,
            message: "All fields are required"
        })
    }

    try {
        console.log('Inside try block');

        const userExist = await db.user.findUnique({
            where: { email }
        })
        if (userExist) {
            // console.log('User already exist');
            return res.status(409).json({
                success: false,
                message: 'user already exist',
            })
        }
        // console.log('User did not exist');

        // console.log("Normal password", password);
        const hashedPassword = await bcrypt.hash(password, 12);
        // console.log("hashed password", hashedPassword);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        if (!newUser) {
            res.status(422).json({
                success: false,
                message: "Failed to register new user, Try again!"
            })
        }
        // console.log("Newly registered user", newUser);
        res.status(200).json({
            success: true,
            message: "User registered successfully"
        })



    } catch (error) {
        console.log("Error occured: ", error);
        return res.status(500).json({
            success: false,
            message: 'Unexpected error occured'
        })
    }

}

export const userLoginController = async (req, res) => {

}

export const userCheckController = async (req, res) => {

}

export const userLogoutController = async (req, res) => {

}