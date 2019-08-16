const bycript = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const events = async () => {
    try {
        let events = await Event.find();
        return events.map(e => {
            return {
                ...e._doc,
                _id: e._doc._id.toString(),
                date: new Date(e._doc.date).toISOString(),
                creator: user.bind(this, e._doc.creator)
            }
        });
    } catch (err) {
        throw err;
    }
}

const singleEvent = async (eventId) => {
    try {
        let event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event._doc._id.toString(),
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator)
        }
    } catch (err) {
        throw err;
    }
}


const user = async (userId) => {
    try {
        //console.log(userId);
        const u = await User.findById(userId);
        return {
            ...u._doc,
            id: u._doc._id.toString(),
            password: "*****"
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    events: events,
    createEvent: async (args) => {
        // console.log(args.eventInput);
        try {
            const event = new Events({
                title: args.eventInput.title,
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5d204a5559408c1214df10e6"
            });
            let createdEvent;
            let result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            let u = await User.findById("5d204a5559408c1214df10e6");
            //console.log("CE", u)
            if (!u) {
                throw new Error("User Does Not Exisit");
            }
            u.createdEvents.push(event);
            console.log("user", user)
            await u.save();
            //console.log("CE", createdEvent)
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    booking: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { 
                    ...booking._doc,
                    _id: booking.id,
                    user : user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString() 
                }
            });

        } catch (error) {
            throw error;
        }
    },
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
    bookEvent: async args => {
        const fetchEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: "5d204a5559408c1214df10e6",
            event: fetchEvent
        });
        const result = await booking.save();
        return { 
            ...result._doc, 
            _id: result.id,
            user : user.bind(this, result._doc.user),
            event: singleEvent.bind(this, result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(), 
            updatedAt: new Date(result._doc.updatedAt).toISOString() 
        }
    },
    cancelBooking: async args => {
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event  = {
            ...booking.event._doc,
            _id : booking.event.id,
            creator: user.bind(this, booking.event._doc.creator)
        };
        await Booking.deleteOne({_id: args.bookingId});
        return event;
    }
}