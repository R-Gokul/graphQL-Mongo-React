const Event = require("../../models/event");
const User = require("../../models/user");

const transformEvent = e =>{
    return {
        ...e._doc,
        _id: e._doc._id.toString(),
        date: new Date(e._doc.date).toISOString(),
        creator: user.bind(this, e._doc.creator)
    }
}

const transformBooking = booking => {
    return { 
        ...booking._doc,
        _id: booking.id,
        user : user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString() 
    }
}

const singleEvent = async (eventId) => {
    try {
        let event = await Event.findById(eventId);
        return transformEvent(event);
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

exports.user = user;
exports.singleEvent =  singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;