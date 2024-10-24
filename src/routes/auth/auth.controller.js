const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");
const crypto = require('crypto');
const APIError = require("../../utils/APIError");
const User = require("../../models/user.model");

const getJWT = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "14d",
    });
};

const comparePassword = (password, hashedPassword) => {

    // const adjustedHash = hashedPassword.replace(/^\$2y(.+)$/i, '$2a$1');
    return bcrypt.compareSync(password, hashedPassword);
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id); // Use await here to ensure the user is fetched
        if (!user) return next(new APIError("User not found", 404, true));

        if (user.todos.length > 0) {
            await Promise.all(
                user.todos.map((todoId) =>
                    Device.findByIdAndDelete(todoId).catch((err) => {
                        logger.error(
                            `Unable to delete user's todo with id ${todoId}: ${util.inspect(err)}`
                        );
                    })
                )
            );
        }
        await User.findByIdAndDelete(user._id);
        res.status(200).json({
            success: true,
        });
    } catch (err) {
        if (err.name === "CastError") {
            return next(new APIError("User not found", 404, true));
        } else return next(new APIError(err.message, err.status, false));
    }
};

const login = async (req, res, next) => {
    const error = new APIError(
        "Authentication failed. Incorrect credentials.",
        401,
        true
    );

    try {
        const user = await User.findOne({ email: req.body.email })
            .select("-__v")
            .populate("todos", "-__v");

        // const salt = user.salt; 
        // const iterations = 10000;
        // const keylen = 32;
        // const digest = 'sha512';

        // const hashedInputPassword = crypto.pbkdf2Sync(req.body.password, salt, iterations, keylen, digest).toString('hex');
        // console.log(hashedInputPassword);

        if (!user || req.body.password !== user.password) {
            return next(error);
        }

        const token = getJWT(user._id);
        user.password = undefined;

        return res.status(200).json({
            token,
            user,
        });
    } catch (err) {
        next(err);
    }
};

const signup = async (req, res, next) => {
    try {
        // Check if user with same email exists
        const existingUser = await User.findOne({ email: req.body.email }).select("_id");
        if (existingUser) {
            return next(new APIError("User already exists", 400, true));
        }

        // const salt = crypto.randomBytes(16).toString('hex').slice(0, 16);

        // const iterations = 10000;
        // const keylen = 32;
        // const digest = 'sha512';

        // const hashedPassword = crypto.pbkdf2Sync(req.body.password, salt, iterations, keylen, digest).toString('hex');

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        const savedUser = await user.save();

        savedUser.password = undefined;
        const token = getJWT(savedUser._id);
        res.json({
            token,
            user: { ...savedUser.toObject(), __v: undefined },
        });
    } catch (e) {
        next(e);
    }
};

// Uncomment and update the token verification function if needed
// const token = (req, res, next) => {
//     const gotToken = req.body.token;
// 
//     jwt.verify(gotToken, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             logger.error("JWT ERROR: " + util.inspect(err));
//             return next(new APIError("Invalid Token", 400, true));
//         }
// 
//         if (!decoded._id) return next(new APIError("Invalid Token", 401, true));
// 
//         User.findOne({ _id: decoded._id })
//             .populate("devices", "-values")
//             .then((foundUser) => {
//                 if (!foundUser)
//                     return next(new APIError("Invalid token", 401, true));
//                 foundUser.password = undefined;
//                 return res.status(200).json({
//                     success: true,
//                     user: foundUser,
//                 });
//             });
//     });
// };

module.exports = { login, signup, deleteUser };
