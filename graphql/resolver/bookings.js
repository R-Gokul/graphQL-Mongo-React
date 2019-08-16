const Booking = require("../../models/booking");
const Event = require("../../models/event");
const {transformBooking, transformEvent} = require("./helper");

module.exports = {
    booking: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                 return transformBooking(booking); 
            });

        } catch (error) {
            throw error;
        }
    },
    bookEvent: async args => {
        const fetchEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: "5d204a5559408c1214df10e6",
            event: fetchEvent
        });
        const result = await booking.save();
        return transformBooking(result); 
    },
    cancelBooking: async args => {
        const booking = await Booking.findById(args.bookingId).populate('event');
        if (!booking) {
            throw new Error("Booking ID does not exisit");
        }
        const event   = transformEvent(booking.event);
        await Booking.deleteOne({_id: args.bookingId});
        return event;
    }
}