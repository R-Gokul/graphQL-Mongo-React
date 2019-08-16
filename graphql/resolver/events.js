const Event = require("../../models/event");
const User = require("../../models/user");
const {transformEvent} = require('./helper');

module.exports = {
    events: async () => {
        try {
            let events = await Event.find();
            console.log("H", events)
            return events.map(e => {
                return transformEvent(e);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        // console.log(args.eventInput);
        if(!req.isAuth){
            throw new Error("Unauthorised");
        }

        try {
            const event = new Event({
                title: args.eventInput.title,
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5d204a5559408c1214df10e6"
            });
            let result = await event.save();
            let createdEvent = transformEvent(result);
            let u = await User.findById("5d204a5559408c1214df10e6");
            //console.log("CE", u)
            if (!u) {
                throw new Error("User Does Not Exisit");
            }
            u.createdEvents.push(event);
            //console.log("user", user)
            await u.save();
            //console.log("CE", createdEvent)
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        };
    }
}