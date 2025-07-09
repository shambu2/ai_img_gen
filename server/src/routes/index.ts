import express, { Router } from "express";
import multer from "multer";
import fs from "fs";
// import { configDotenv } from "dotenv";
import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";
// import mime from "mime-types";
import mime from "mime-types";

dotenv.config();
const router = express.Router();


const storage = multer.diskStorage({
  destination: (
    req: express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, '../uploads/'); // Save files to uploads directory
  },
  filename: (
    req: express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for specific file types
const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept images and PDFs only
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images and PDFs are allowed'));
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: fileFilter,
});

router.post('/upload/single', upload.single('file'), (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during file upload' });
  }
});




router.get("/", (req, res) => {
  res.json({ Prompt: "hello world from routes" });
  
});


// router.post("/ai", upload.single("image"), async (req, res) => {

//   const filePath = path.resolve(req.file?.path || "");
//   const mimeType = mime.lookup(filePath); 

//   if (!mimeType || !mimeType.startsWith("image/")) {
//     fs.unlinkSync(filePath);
//     return res.status(400).json({ error: "Unsupported file type" });
//   }
//   const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
//   const dataUrl = `data:${mimeType};base64,${base64Image}`;

//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     baseURL: process.env.BASE_URL,
//   });
// //   const Prompt = req.body;
//   const response = await openai.chat.completions.create({
//       model: "gpt-4-vision-preview",
//       messages: [
//         {
//           role: "user",
//           content: [
//             { type: "text", text: "What's in this image?" },
//             {
//               type: "image_url",
//               image_url: {
//                 url: dataUrl,
//               },
//             },
//           ],
//         },
//       ],
//     });



// //   const result = await openai.chat.completions.create({
// //     model: "gpt-4.1",
// //     messages: [
// //       {
// //         role: "system",
// //         content:
// //           "You are a creative strategist for social media who generates visually appealing prompts for Instagram content. Use your understanding of current visual trends and adapt your prompts based on the context given by the user. Focus on concise, imaginative descriptions suitable for image generation or content creation. ",
// //       },
// //       {
// //         role: "user",
// //         content: `${Prompt}`,
// //       },
// //     ],
// //   });

//   return res.json(response.choices[0].message.content);
// });

export default router;
