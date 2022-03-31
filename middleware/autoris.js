function isAdmin(req,res,next) {
    if(req.user.role != 'admin')
        return res.status(401).send('You must be admin to do this');
    next();
}
module.exports=isAdmin;