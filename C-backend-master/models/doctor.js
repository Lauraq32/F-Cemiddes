const { Schema, model} = require('mongoose');
const DoctorSchema = Schema({
    name: {
        type: String,
        required: [true, 'el nombre de la doctor es necesario'],
    },
    phone: {
        type: String,
        required: [true],
    },
    date: {
        type: Date,
    },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }]
});


module.exports = model('Doctor', DoctorSchema);