import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import UserAuthRoutes from './Routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.get('/', (req, res) => {
    console.log("Route is working");
    res.status(200).json({
        success: true,
        meesage: "Home Route is working😃"
    })
})

app.use('/api/v1/authRoute/', UserAuthRoutes)

app.listen(PORT, (req, res) => {
    console.log("Server is running at port no", PORT);

})