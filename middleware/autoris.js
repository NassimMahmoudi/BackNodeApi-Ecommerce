function isAdmin(req,res,next) {
    if(req.user.role != 'AGENT')
        return res.status(401).json({ message : 'You must be admin to do this' });
    next();
}
module.exports=isAdmin;