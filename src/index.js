import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const app=express();
const PORT=process.env.PORT;

app.listen(PORT,(req,res)=>{
    console.log("Server is running at port no",PORT);
    
})