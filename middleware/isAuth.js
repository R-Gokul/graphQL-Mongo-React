let jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const authHeader = req.get('Authentication');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // Bare twerewrwerwrwrwr
    console.log(token);
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }
    try{ 
        
    let decoder = jwt.verify(token, "thisisSecretKey");
    if(!decoder){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decoder.userId;
    return next();

    }catch(err){
        console.log("err", err)
        req.isAuth = false;
        next();
    }
}