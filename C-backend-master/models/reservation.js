const { Schema, model} = require('mongoose');
const ReservationSchema = Schema({
    concept: {
        type: String,
        required: [true],
    },
    phone: {
        type: String,
        required: [true],
    },
    date: {
        type: Date,
        required: [true, 'la fecha es necesaria'],
    },
    amountPayable: {
        type: Number,
        required: [true],
    },
    paymentType: {
        type: String,
        required: [true],
    },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
    patientTreatment: { type: Schema.Types.ObjectId, ref: 'patientTreatment' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    percent: {
        type: Number,
    },
});

module.exports = model('Reservation', ReservationSchema);