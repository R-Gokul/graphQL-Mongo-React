const bycript = require("bcryptjs");
const Events = require("../../models/event");
const User  = require("../../models/user");


const user = userId => {
    //console.log(userId);
   return User.findById(userId).then(u =>{
        return {
            ...u._doc,
            id : u._doc._id.toString(),
            password: "*****"
        }
   }).catch(err=>{
       throw err;
   })
}

module.exports = {
    events: () =>{
        return Events.find().then(events => {
            return events.map(e =>{
                return  {
                    ...e._doc,
                    _id: e._doc._id.toString(),
                    date: new Date(e._doc.date).toISOString(),
                    creator: user.bind(this, e._doc.creator)
                    }
            });
        }).catch(err =>{
            throw err
        });
    },

    createEvent: (args) => {
        // console.log(args.eventInput);
     
        const event =  new Events({
            title: args.eventInput.title,
            title :args.eventInput.title,
            description : args.eventInput.description,
            price : args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5d204a5559408c1214df10e6"
        });
        let createdEvent;
        return event.save()
            .then(result => {
                createdEvent = {...result._doc,
                 _id:result._doc._id.toString(), 
                 date: new Date(e._doc.date).toISOString(),
                 creator: user.bind(this, result._doc.creator)}
            return User.findById("5d204a5559408c1214df10e6");
            })
            .then(user=>{
                //console.log(user)
                //console.log("CE", createdEvent)
                if(!user){
                    throw new Error("User Does Not Exisit");
                }
                user.createdEvents.push(event);
                //console.log("user", user)
                return user.save();
            }).then(()=>{
                //console.log("CE", createdEvent)
                return createdEvent;
            //console.log("R", result);
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createUser: (args) =>{
        console.log(args);
        return User.findOne({email:args.userInput.email}).then(user=>{
            if(user){
                throw new Error("User Name already exisit");
            }
            return bycript.hash(args.userInput.password, 12)
        }).then(hash=>{
            return user = new User({
                email: args.userInput.email,
                password: hash
            });
        }).then(user =>{
            return user.save().then(result => {
               // console.log("R", result);
                return {...result._doc,password: "******", id:result._doc._id.toString()}
            })
        }).catch(err => {
            console.log(err);
            throw err;
        });
        
    }
}