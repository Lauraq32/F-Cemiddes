const { response, request } = require("express");
const Product = require("../models/product");

class ProductController {
  static async post(req, res) {
    const product = new Product({
      name: req.body.name,
      amount: req.body.amount,
      price: req.body.price,
    });

    try {
      const result = await product.save();
      const data = result.toObject();

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).end();
    }
  }

  static async get(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).end();
      }

      const data = product.toObject();

      return res.status(200).json({
        ...data,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async getAll(req, res) {
    try {
      let products = await Product.find();

      if (!products) {
        return res.status(404).end();
      }

      return res.status(200).json({
        products,
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
        amount: req.body.amount,
        price: req.body.price,
      };

      await Product.updateOne({ _id: id }, { $set: fields });

      return res.status(200).json({
        message: "prducto actualizado",
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      await Product.findByIdAndDelete(id);

      return res.status(200).json({
        message: "producto borrado",
      });
    } catch (error) {
      return res.status(404).end();
    }
  }
}

module.exports = ProductController;