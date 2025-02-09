const User = require("../model/userModel");
const brycypt = require("bcrypt");
module.exports.register = async (req, res, next) => {
    try{
        const {username,email,password}=req.body;
        console.log(username);
        const usernameCheck = await User.findOne({username});
        if(usernameCheck){
            return res.json({msg: "Username already used", status: false});
        }
        const emailCheck = await User.findOne({email});
        if(emailCheck){
            return res.json({msg: "Email already used", status: false});
        }
        const hashedPassword = await brycypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({status: true, user});
    } catch (ex){
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try{
        const {username,password}=req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.json({msg: "Incorrect username", status: false});
        }
        const passwordCheck = await brycypt.compare(password, user.password);
        if(!passwordCheck){
            return res.json({msg: "Incorrect password", status: false});
        }
        delete user.password;
        return res.json({status: true, user});
    } catch (ex){
        next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch(ex){
        next(ex)
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find({_id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (ex){
        next(ex);
    }
}