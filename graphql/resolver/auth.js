const bycript = require("bcryptjs");
const User = require("../../models/user");

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
    }
}