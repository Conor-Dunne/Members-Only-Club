import bcrypt from "bcrypt";
import User from "../models/user.js";

//Register User

exports.register_user = async(req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10, async(err, hashedpassword)=> {
            if(err) {
                return next(err);
            }
            const user = new User({
                username: req.body.username,
                password: hashedpassword
            });
            const result = await user.save();
            res.redirect("/");
        })
    } catch(err) {
        return next(err);
    }
}