const bycript = require("bcryptjs");
const Events = require("../../models/event");
const User  = require("../../models/user");

const events = async()=> {
    try {
        let events = await Events.find(); 
        return events.map(e =>{
            return  {
                ...e._doc,
                _id: e._doc._id.toString(),
                date: new Date(e._doc.date).toISOString(),
                creator: user.bind(this, e._doc.creator)
                }
        });
    }catch(err){
        throw err;
    }
}


const user = async (userId) => {
    try {
    //console.log(userId);
   const u = await User.findById(userId);
   return {
            ...u._doc,
            id : u._doc._id.toString(),
            password: "*****"
        }
   }catch(err){
       throw err;
   }
}

module.exports = {
    events: events,
    createEvent: async (args) => {
        // console.log(args.eventInput);
        try {
        const event =  new Events({
            title: args.eventInput.title,
            title :args.eventInput.title,
            description : args.eventInput.description,
            price : args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5d204a5559408c1214df10e6"
        });
        let createdEvent;
        let result = await event.save();
        createdEvent = {...result._doc,
            _id:result._doc._id.toString(), 
            date: new Date(result._doc.date).toISOString(),
            creator: user.bind(this, result._doc.creator)};
        let u = await User.findById("5d204a5559408c1214df10e6");
        //console.log("CE", u)
        if(!u){
            throw new Error("User Does Not Exisit");
        }
        u.createdEvents.push(event);
        console.log("user", user)
        await u.save();
        //console.log("CE", createdEvent)
        return createdEvent;
        }catch(err) {
            console.log(err);
            throw err;
        };
    },
    createUser: async (args) =>{
        try {
        console.log(args);
        let u = await User.findOne({email:args.userInput.email});
        if(u){
            throw new Error("User Name already exisit");
        }
        let hash = await bycript.hash(args.userInput.password, 12);
        const  user = new User({
            email: args.userInput.email,
            password: hash
        });
        
        let result = await user.save();
        return {...result._doc,password: "******", id:result._doc._id.toString()}
        }catch(err) {
            console.log(err);
            throw err;
        }
    }
}