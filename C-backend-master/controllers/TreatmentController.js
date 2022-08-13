const Treatment = require("../models/treatment");

class TreatmentController {
  static async post(req, res) {
    const treatment = new Treatment({
      name: req.body.name,
      total: req.body.total,
    });

    try {
      const result = await treatment.save();
      const data = result.toObject();

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).end();
    }
  }

  static async get(req, res) {
    const { id } = req.params;

    try {
      const treatment = await Treatment.findById(id);

      if (!treatment) {
        return res.status(404).end();
      }

      const data = treatment.toObject();

      return res.status(200).json({
        ...data,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async getAll(req, res) {
    try {
      let treatments = await Treatment.find();

      if (!treatments) {
        return res.status(404).end();
      }

      return res.status(200).json({
        treatments,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  }

  static async put(req, res) {
    try {
      const { id } = req.params;

      const fields = {
        name: req.body.name,
        total: req.body.total,
      };

      await Treatment.updateOne({ _id: id }, { $set: fields });

      return res.status(200).json({
        message: "tratamiento actualizado",
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      await Treatment.findByIdAndDelete(id);

      return res.status(200).json({
        message: "tratamiento borrado",
      });
    } catch (error) {
      return res.status(404).end();
    }
  }
}

module.exports = TreatmentController;
