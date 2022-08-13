const { response, request } = require("express");
const User = require("../models/user");
const crypto = require("crypto");
const { SECRETORPRIVATEKEY } = require("../config");
const { getJWT } = require("../helpers/generate-jwt");

class UserController {
  static async post(req, res) {
    const sha256Hasher = crypto.createHmac("sha256", SECRETORPRIVATEKEY);
    const hash = sha256Hasher.update(req.body.password).digest("hex");

    const user = new User({
      name: req.body.name,
      lastname: req.body.lastname,
      rol: req.body.rol,
      email: req.body.email,
      password: hash,
    });

    try {
      await user.save();
      const userObj = user.toObject();
      const token = await getJWT(user._id);
      delete userObj.password;
      return res.status(201).json({
        ...userObj,
        token,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const sha256Hasher = crypto.createHmac("sha256", SECRETORPRIVATEKEY);
      const hash = sha256Hasher.update(password).digest("hex");

      const user = await User.findOne({ email, password: hash });
      if (!user) {
        return res.status(401).json({
          msg: "Invalid credentials",
        });
      }
      const token = await getJWT(user.id);
      //guardar el token en una cookie y extraer de la cookie

      return res.json({
        user,
        token,
      });
    } catch (err) {
      return res.status(500).end();
    }
  }

  static async get(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).end();
      }

      const data = user.toObject();

      return res.status(200).json({
        ...data,
      });
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async put(req, res) {
    const sha256Hasher = crypto.createHmac("sha256", SECRETORPRIVATEKEY);
    const hash = sha256Hasher.update(req.body.password).digest("hex");
    try {
      const user = await User.findById(req.params.id);
      const fields = {
        name: req.body.name,
        lastname: req.body.lastname,
        rol: req.body.rol,
        email: req.body.email,
        password: hash,
      };
      if (user.userId === req.body.userId) {
        await user.updateOne({ $set: fields, password: hash });
        return res.status(200).json({
          message: "usuario actualizado",
        });
      }
    } catch (error) {
      return res.status(500).end();
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      await User.findByIdAndDelete(id);

      return res.status(200).json({
        message: "usuario borrado",
      });
    } catch (error) {
      return res.status(404).end();
    }
  }
}

module.exports = UserController;
