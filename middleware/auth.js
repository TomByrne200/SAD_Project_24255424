function requireLogin(req,res, next){ //allows logged in users only, others will be redirected
    if (!req.session.user){
        return res.redirect('/login');
    }
    next();
}

function requireRole(role) { //allows users with set user role, others will be given 403 code
    return (req, res, next) => {
        if (req.session.user) {
            return res.redirect('/login');
        }
        if (req.session.user.role !== role){
            return res.status(403).send('Access Denied');
        }
        next();
    };
}
module.exports = {requireLogin, requireRole};