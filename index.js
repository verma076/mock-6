const express= require("express")
const {connection}= require("./db");
const {UserRouter}=require('./routes/user.router')
const {BlogRouter} = require('./routes/blog.router')
const cors=require("cors")
require("dotenv").config()
const app= express();


app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).send({"msg":"This is a Home page"})
})

app.use("/users",UserRouter)

app.use("/blog",BlogRouter)



const PORT=process.env.Port


app.listen(PORT,async()=>{

    try{

         await connection

         console.log("Server is connected to Db")

         console.log(`Server is running at ${PORT}`)

    }catch(err){

        console.log(err)
        
    }
})