import express from "express"
import allRoutes from "./routes";
import cors from "cors"
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/routes',allRoutes)

app.listen(5000,()=>{
    console.log("server is started")
})