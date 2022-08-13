const { response, request } = require("express");
const Doctor = require("../models/doctor");

class DoctorController {
  static async post(req, res) {
    const doctor = new Doctor({
      name: req.body.name,
      phone: req.body.phone,
      totaldeganancias: 0,
    });

    try {
      const result = await doctor.save();
      const data = result.toObject();

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).end();
    }
  }

  static async get(req, res) {
    const { id } = req.params;

    try {
      const doctor = await Doctor.findById(id).populate("reservations");

      if (!doctor) {
        return res.status(404).end();
      }

      let totaldeganancias = 0;
      doctor.reservations.forEach((reservation) => {
        const ganancia =
          reservation.amountPayable * (reservation.percent / 100);
        totaldeganancias += ganancia;
      });

      doctor.totaldeganancias = totaldeganancias;

      const result = doctor.toObject();
      result.totaldeganancias = totaldeganancias;

      return res.status(200).json({
        doctor: result,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async getAll(req, res) {
    try {
      let doctors = await Doctor.find().populate("reservations");

      if (!doctors) {
        return res.status(404).end();
      }

      doctors = doctors.map((doctora) => {
        let totaldeganancias = 0;

        doctora.reservations.forEach((reservation) => {
          const ganancia =
            reservation.amountPayable * (reservation.percent / 100);
          totaldeganancias += ganancia;
        });

        const result = doctora.toObject();
        result.totaldeganancias = totaldeganancias;

        return result;
      });

      return res.status(200).json({
        doctors,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async put(req, res) {
    try {
      const { id } = req.params;

      const fields = {
        name: req.body.name,
        phone: req.body.phone,
      };

      await Doctor.updateOne({ _id: id }, { $set: fields });

      return res.status(200).json({
        message: "doctora actualizada",
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      await Doctor.findByIdAndDelete(id);

      return res.status(200).json({
        message: "doctora borrada",
      });
    } catch (error) {
      return res.status(404).end();
    }
  }
}

module.exports = DoctorController;
