const mongoos = require('mongoose');
const Schema  = mongoos.Schema;

const booking = new Schema({
        event: {
            type: Schema.Types.ObjectId,
            reff: 'Event'
        },
        user: {
            type: Schema.Types.ObjectId,
            reff: 'User'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoos.model("Booking", booking)