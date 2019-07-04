const Mongoose = require("mongoose");

const Schema = Mongoose.Schema;

let userSchema = new Schema({
    email :{
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    createdEvents: [
        {
            type : Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

module.exports = Mongoose.model("User", userSchema);