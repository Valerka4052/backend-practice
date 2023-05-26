
import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import { registerValidator,loginValidator } from "./validations/user.js"
import { checkToken } from './middlewares/checkAuth.js';
import { register, login, getCurrent } from "./controllers/auth.js";
import { createPost, removePost, updatePost, getAllPosts, getPostsById, uploadImage, removeImage } from './controllers/postController.js';
import { postCreateValidation, postUpdateValidation } from './validations/post.js';

import multer from "multer";
import { handleValidationError } from "./middlewares/handleValidationError.js";
import dotenv from 'dotenv'
dotenv.config();

const { MONGOOSE_URL, PORT = 4444 } = process.env;
console.log(MONGOOSE_URL);

const app = express();
mongoose.connect(MONGOOSE_URL).then(() => console.log('MOGO OK')).catch(() => console.log('MOGO ERROR'));
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
app.use(cors())
app.use(express.json());
app.use('/uploads',express.static('uploads'));
// app.use(express.static('public-images'));

app.post('/auth/register', registerValidator, handleValidationError,register);
app.post('/auth/login', loginValidator,handleValidationError, login);
app.get('/auth/me', checkToken, getCurrent);

app.post('/uploads/image', checkToken, upload.single('imageURL'), uploadImage);
app.patch('/uploads/image', checkToken, removeImage);

app.post('/posts', checkToken, postCreateValidation, handleValidationError, createPost);
app.delete('/posts/:postId', checkToken, removePost);
app.patch('/posts/:postId', checkToken, postUpdateValidation, handleValidationError, updatePost);
app.get('/posts',  getAllPosts);
app.get('/posts/:postId',  getPostsById);

app.listen(4444, (err) => { err ? console.log(err) : console.log(`server running on port ${PORT}`) });