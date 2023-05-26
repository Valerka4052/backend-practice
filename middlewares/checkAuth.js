import jwt from "jsonwebtoken";
const SECRET_KEY = 'ioufhpouh';

export const checkToken = (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== "Bearer") return res.starus(403).json('No token');
    try {
        const decodeToken = jwt.verify(token, SECRET_KEY);
        req.user = decodeToken;
        next()
    } catch (error) {
        console.log(error);
        return res.starus(403).json('No token');
    };
};