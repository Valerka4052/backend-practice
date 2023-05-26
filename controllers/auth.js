import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
const SECRET_KEY = 'ioufhpouh'

export const register = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ message: 'user is already exist' });
        const { email, password, fullName } = req.body;
        const passwordHash = await bcrypt.hash(password, 7);
        const newUser = await User.create({ email, passwordHash, fullName });
        const token = jwt.sign({ _id: newUser._id }, SECRET_KEY, { expiresIn: "24h" });
        res.status(201).json({ status: 'sucsess', email: newUser.email, name: newUser.fullName, token,id:user._id });
    } catch (error) {
        console.log(error);
        res.status(500).json('register is not sucsess');
    };
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'email or password is wrong' });
        const validatedPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validatedPassword) return res.status(404).json({ message: 'email or password is wrong' });
        const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "24h" });
        res.status(201).json({ status: 'sucsess', email: user.email,id:user._id, name: user.fullName, token });
    } catch (error) {
        console.log(error);
        res.status(500).json('register is not sucsess');
    };
};

export const getCurrent = async (req, res) => {
    try {
        if(!req.user)res.json('user not found')
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'user not found' });
        res.status(200).json({ email: user.email, fullName: user.fullName ,id:user._id});
    } catch (error) {
        console.log(error);
        res.status(500).json('register is not sucsess');
    };
};