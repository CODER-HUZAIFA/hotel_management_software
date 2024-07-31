import { User } from "../models/user.models.js";
import { auth } from "../utils/auth.js";

const userRegistrationHandle = async (req, res) => {
    const userCheck = await User.findOne({ username: req.body.username });
    if(userCheck) return res.redirect("/");

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        fullName: req.body.fullName,
        age: req.body.age,
        password: req.body.password
    });

    const token = auth(user)
    res.cookie("uid", token, {expires: new Date(Date.now() + 86400000)})
    return res.status(200).redirect(`/user/${user._id}`)
}

const userLoginHandler = async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username, email, password })
    if(!user) return res.status(404).send("User is not exist please login");
    
    const token = auth(user)
    res.cookie("uid", token, {expires: new Date(Date.now() + 86400000)})
    return res.status(200).redirect(`/user/${user._id}`)
}

const userEdit = async (req, res) => {
    const user = await User.findOneAndUpdate({_id: req.params.userId}, {
        username: req.body.username,
        email: req.body.email,
        age: req.body.age,
        fullName: req.body.fullName
    }, {new: true})
    await user.save();
    res.redirect(`/user/${user._id}`)
}

const passwordHandler = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if(!user) return res.send("Error occur");
    if(!req.cookies.uid) return res.send("Error occur");

    if(user.password !== req.body.old) return res.send("Something went wrong");

    user.password = `${req.body.new}`
    await user.save();
    res.redirect(`/user/${user._id}`)
}

export {
    userRegistrationHandle,
    userLoginHandler,
    userEdit,
    passwordHandler,
}