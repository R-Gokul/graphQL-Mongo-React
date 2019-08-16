const bycript = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: async (args) => {
        try {
            console.log(args);
            let u = await User.findOne({ email: args.userInput.email });
            if (u) {
                throw new Error("User Name already exisit");
            }
            let hash = await bycript.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hash
            });

            let result = await user.save();
            return { ...result._doc, password: "******", id: result._doc._id.toString() }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    login : async ({email, password}) =>{
        let user = await User.findOne({email: email});
        if(!user){
            throw new Error("User Dose not exisit");
        } 
        let isMatch = await bycript.compare(password, user.password);
        if(!isMatch){
            throw new Error("User name and password dose not match.");
        }
        let token = jwt.sign({userId: user.id, expireOn: 1}, "thisisSecretKey",{
            expiresIn:'1h'
        })

        return {
            userId : user.id,
            token : token,
            expireOn: 1
        }
    }
}