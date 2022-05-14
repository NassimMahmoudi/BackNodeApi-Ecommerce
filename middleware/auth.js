const jwt = require('jsonwebtoken');
function valideToken(req,res,next) {
    console.log
    let token = req.headers['x-access-token'];
    if(!token)
        return res.status(200).json({ message : 'A token is required.'});
    try {
        //token = Bearer jwtToken
        //let arr = token.split(' ');
        //arr[1]
        let decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user=decoded;
        console.log(req.user)
    } catch (error) {
        return res.status(200).json({ message : 'Invalid Token : '+error.message });
    }
    next();
};

module.exports=valideToken;