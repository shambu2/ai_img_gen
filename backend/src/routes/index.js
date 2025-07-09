import express from "express"
import multer from "multer";
import path from "path"

//instagram (2images ,prompt, excract promt image , use that to mask)

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null,"./uploads")
    },
    filename: function(req,file,cb){
        const ext = path.extname(file.originalname);
        // const name = path.basename(file.originalname) 
        return cb(null,`${Date.now()}-${ext

        }`)
    }
})

const upload = multer({storage:storage});

const uploadMiddleware = upload.fields([{name:"user",maxCount:1},{name: "reference",maxCount:1}])

router.post('/send',uploadMiddleware,(req,res)=>{


    console.log(req.files);
    return res.json("from this")
})

router.get('/',(req,res)=>{
    res.json("hello from routes")
})



export default router;