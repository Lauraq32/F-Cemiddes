const { Schema, model } = require('mongoose');
const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    lastname: {
        type: String,
        required: [true]
    },
    rol: {
        type: String,
        required: true,
        default: 'NOADMIN',
        emun: ['ADMIN', 'NOADMIN']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        bufferCommands: false,
    },
    password: {
        type: String,
        required: [true, 'the password is mandatory'],
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user  } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);