const Reservation = require("../models/reservation");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const patientTreatment = require("../models/patientTreatment");
const Product = require("../models/product");

class ReservationController {
  static async post(req, res) {
    const doctor = await Doctor.findById(req.body.doctorId);
    const patient = await Patient.findById(req.body.patientId);
    const treatment = await patientTreatment.findById(
      req.body.patientTreatmentId
    );
    const productIds = req.body.productIds;
    const reservations = new Reservation({
      concept: req.body.concept,
      phone: req.body.phone,
      amountPayable: req.body.amountPayable,
      paymentType: req.body.paymentType,
      date: req.body.date,
      doctor: doctor._id,
      patient: patient._id,
      patientTreatment: treatment._id,
      products: productIds,
      percent: req.body.percent,
    });

    try {
      reservations.save().then(async (result) => {
        const reservationObj = result.toObject();
        patient.reservations.push(reservationObj._id);
        doctor.reservations.push(reservationObj._id);
        treatment.reservations.push(reservationObj._id);

        //descontar productos del inventario
        for (let i = 0; i < productIds.length; i++) {
          const query = { $inc: { amount: -1 } };
          await Product.findByIdAndUpdate(productIds[i], query);
        }

        await doctor.save();
        await patient.save();
        await treatment.save();
        return res.status(201).json({
          ...reservationObj,
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  }

  static async getClientByTreatment(req, res) {
    const { id } = req.params;

    try {
      const clients = await Patient.findById(id).populate("patientTreatments");

      return res.status(200).json({
        clients,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async getReservationByDate(req, res) {
    const firstDate = new Date(req.query.firstDate);
    let lastDate = new Date(req.query.lastDate).getTime() + 86400000;
    lastDate = new Date(lastDate);

    try {
      const match = {
        date: { $gte: firstDate, $lt: lastDate },
      };

      const pipeline = [{ $match: match }];

      const reservation = await Reservation.aggregate(pipeline);

      return res.status(200).json({
        reservation,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async getEarningsByDate(req, res) {
    const firstDate = new Date(req.query.firstDate);
    let lastDate = new Date(req.query.lastDate).getTime() + 86400000;
    lastDate = new Date(lastDate);

    try {
      const match = {
        date: { $gte: firstDate, $lt: lastDate },
      };
      const group = {
        _id: "$doctor",
        payments: {
          $push: {
            amount: "$amountpayable",
            percent: "$percent",
            date: "$date",
          },
        },
        total: { $sum: { $multiply: ["$amountpayable", "$percent", 0.01] } },
      };
      const project = {
        doctorId: "$_id",
        payments: "$payments",
        _id: false,
        total: "$total",
      };

      const pipeline = [
        { $match: match },
        { $group: group },
        { $project: project },
      ];
      const earnings = await Reservation.aggregate(pipeline);
      return res.status(200).json({
        earnings,
      });
    } catch (error) {
        console.log(error);
      return res.status(500).end();
    }
  }

  static async getAll(req, res) {
    try {
      const reservations = await Reservation.find()
        .populate("doctor")
        .populate("patient")
        .populate({
          path: 'patientTreatment',
          populate: {
            path: 'treatment',
            model: 'Treatment'
          }
        });

      return res.status(200).json({
        reservations,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      await Reservation.findByIdAndDelete(id);

      return res.status(200).json({
        message: "reservacion borrada",
      });
    } catch (error) {
      return res.status(404).end();
    }
  }

  static async put(req, res) {
    try {
      const { id } = req.params;
      const doctor = await Doctor.findById(req.body.doctorId);
      const patient = await Patient.findById(req.body.patientId);
      const treatment = await patientTreatment.findById(
        req.body.patientTreatmentId
      );
      const productIds = req.body.productIds;

      const fields = {
        concept: req.body.concept,
        phone: req.body.phone,
        amountPayable: req.body.amountpayable,
        paymentType: req.body.paymenttype,
        date: req.body.date,
        doctor: doctor._id,
        patient: patient._id,
        patientTreatment: treatment._id,
        products: productIds,
        percent: req.body.percent,
      };

      await Reservation.updateOne({ _id: id }, { $set: fields });

      return res.status(200).json({
        message: "reservacion actualizada",
      });
    } catch (error) {
      return res.status(500).end();
    }
  }
}

module.exports = ReservationController;
