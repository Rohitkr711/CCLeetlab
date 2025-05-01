import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const mailSend = async function(registration_VerificationToken,newUser) {

    console.log('inside mail service');
    
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    console.log("mail transporter object creation done");
    
    const mailOptions = {
        from: process.env.MAILTRAP_SENDEREMAIL, // sender address
        to: newUser.email, // list of receivers
        subject: "Verify your email", // Subject line
        text: `please click on the below link:${process.env.BASE_URL}/api/v1/authRoute/verify/${registration_VerificationToken}`, // plain text body
        html: "<b>Check the verification URL</b>", // html body
    }

    // console.log('mail option creation done');
    
    const info = await transporter.sendMail(mailOptions);
    console.log("mail sent from inside mail service");
    return info;

}
