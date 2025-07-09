import express from "express";
const app = express();
import allRoutes from "./routes/index.js"




app.use(express.json())
app.use('/api',allRoutes)

app.get('/',(req,res)=>{
    res.json("hellooooo")
})



app.listen(8000,()=>{
    console.log("server is runnig")
})