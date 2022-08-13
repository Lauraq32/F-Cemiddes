const { Schema, model} = require('mongoose');
const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'el nombre del producto es necesario'],
    },
    amount: {
        type: Number,
        required: [true, 'la cantidad del producto es necesaria'],
    },
    price: {
        type: Number,
        required: [true, 'el precio del producto es necesario'],
    },
});

module.exports = model('Product', ProductSchema);