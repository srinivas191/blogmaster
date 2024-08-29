const { validateToken } = require("../services/authentication.js");

function checkForAuthenticationCookie(cookieName) {
    return (req,res,next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
        return next();
    }
    try {
        const userPayload = validateToken(tokenCookieValue);
        req.user = userPayload;
    } catch (error) {
        console.log("error", error);
    }

    return next();  
};
}

module.exports = { checkForAuthenticationCookie };
