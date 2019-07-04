const mangoos = require("mongoose");


const Schema =  mangoos.Schema;

let eventSchema =  new Schema({
    title: {
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    price:  {
        type: Number,
        require: true
    },
    date : {
        type: Date,
        require: true
    }
});

module.exports= mangoos.model("Event", eventSchema);