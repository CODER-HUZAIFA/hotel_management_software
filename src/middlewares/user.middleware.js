import { User } from "../models/user.models.js";
import { tokenVerify } from "../utils/auth.js"

const isLoggedIn = async (req, res, next) => {
    if(!req.cookies.uid) return res.redirect("/login");
    
    const user = tokenVerify(req.cookies.uid);
    if(!user) return res.redirect("/login");
    const url = `/user/${user.objectId}`

    const loginUser = await User.findOne({ _id: user.objectId })
        .populate("hotels")
    req.user = loginUser;

    if(req.originalUrl !== url) {
        return res.redirect(url);
    }
    
    next();
    return;
}

const isLogged = async (req, res, next) => {
    if(!req.cookies.uid) return res.redirect("/login");
    
    const user = tokenVerify(req.cookies.uid);
    if(!user) return res.redirect("/login");

    const loginUser = await User.findById(user.objectId)
    req.user = loginUser;
    next();
    return;
}

export {
    isLoggedIn,
    isLogged
}