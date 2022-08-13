const express = require('express');
const cors = require('cors');
const {DataBase} = require("../database/db");

class Server {

    constructor() {
        this.app  = express();
        
        this.DataBase();
        this.middlewares();
        this.routes();
    }

    async DataBase() {
        await DataBase();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/patients/treatments', require('../routes/patientTreatments'));
        this.app.use('/api/patients', require('../routes/patients'));
        this.app.use('/api/reservations', require('../routes/reservations'));
        this.app.use('/api/doctors', require('../routes/doctors'));
        this.app.use('/api/products', require('../routes/products'));
        this.app.use('/api/treatments', require('../routes/treatments'));
        this.app.use('/api/auth', require('../routes/auth'));
        this.app.use('/api/users', require('../routes/users'));
        this.app.use('/api/health', require('../routes/healthChecker'));
    }

    listen() {
        const port = process.env.PORT || 8080
        this.app.listen(port, console.log("server running on port 8080"));
    }
}

module.exports = Server;