const mongoos = require('mongoose');
const Schema  = mongoos.Schema;

const booking = new Schema({
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoos.model("Booking", booking)