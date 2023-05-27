import Post from "../models/post.js";
import path from 'path'
import fs from 'fs/promises';
import Jimp from 'jimp';
// import shortid from 'shortid'

// import { URL } from 'url';
// const __dirname = new URL('.', import.meta.url).pathname;

export const createPost = async (req, res) => {
    try {
        const post = (await Post.create({ ...req.body, user: req.user._id }));
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json('failure to create post');
    };
};

export const removePost = async (req, res) => {
    try {
console.log('req.body',req.body);
        const { postId } = req.params
        console.log('postId', postId);
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json('there is no such post in DB');
        await Post.findByIdAndRemove(postId);
        res.status(200).json({ messge: 'deleting sucsess', id: postId });
    } catch (error) {
        console.log(error);
        res.status(500).json('failure to remove post');
    };
};

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOne({ _id: postId, user: req.user._id });
        if (!post) return res.status(400).json('there is no such post in DB');
        const updatedPost = await Post.findByIdAndUpdate(postId, { ...req.body });
        res.status(200).json({...updatedPost._doc});
    } catch (error) {
        console.log(error);
        res.status(500).json('failure to update post');
    };
};

export const getAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find().populate('user').exec();
        res.status(200).json(allPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json('failure to get posts');
    };
};

export const getPostsById = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate({ _id: req.params.postId }, { $inc: { viewsCount: 1 } }, { returnDocument: 'after' });
        res.status(200).json(post._doc);
    } catch (error) {
        console.log(error);
        res.status(500).json('failure to get post');
    };
};
export const removeImage = async (req, res) => {
    try {
        // console.log('req.body', req.body.image);
        // const fullPath = path.join(__dirname, '../', req.body.image);
        // console.log(fullPath);
        if (req.body.id) await Post.findByIdAndUpdate(req.body.id, { imageUrl: null });
        await fs.unlink(req.body.image, (err) => {
            if (err) console.log(err);
            else console.log(`${req.body} was deleted`);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json('failure upload image');
    }
};
export const uploadImage = async (req, res) => {
    await Jimp.read(req.file.path).then((img) => { return img.cover(400, 600).quality(60).writeAsync(req.file.path) });
    res.status(200).json(req.file.path);
};