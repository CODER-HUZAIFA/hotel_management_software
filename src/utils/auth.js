import jwt from "jsonwebtoken";

const secret = "huzaifa"
function auth (user){
    const token = jwt.sign({
        username: user.username,
        email: user.email,
        objectId: user._id
    }, secret, {expiresIn: "1d"})

    return token;
}

function tokenVerify(token) {
    if(!token) return null;

    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null;
    }
}

export {
    auth,
    tokenVerify
}