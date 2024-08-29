const JWT = require("jsonwebtoken");

const secret = "$uperMan123";

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role : user.role,
    };
    const token = JWT.sign(payload,secret);
    return token;
}

function validateToken(Token){
     const payload = JWT.verify(Token,secret);
     return payload;  
}

module.exports = { createTokenForUser , validateToken, };