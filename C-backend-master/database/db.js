const mongoose = require("mongoose");
const {mongoURI} = require('../config');

 const Db = async() => {
//     try {
//         mongoose.connect(
//             mongoURI,
//             () => console.log('Data Base Connected')
//         );
//     } catch (error) {
//         console.log(error);
//         throw new Error('Data Base presented an error!');
//     }
mongoose.connect(
    mongoURI
)
.then(()=>console.log('Database connected'))
.catch(e=>console.log(e));
}

module.exports = {
    DataBase: Db
}