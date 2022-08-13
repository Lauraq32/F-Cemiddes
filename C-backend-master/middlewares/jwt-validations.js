const jwt = require("jsonwebtoken");
const { response, request } = require("express");
const { SECRETORPRIVATEKEY } = require("../config");
const User = require("../models/user");

const jwtValidations = async (req = request, res = response, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      msg: "Need a valid token to proceed",
    });
  }
  try {
    const { uid } = jwt.verify(token, SECRETORPRIVATEKEY);
    const user = await User.findById(uid);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Insert valid token to proceed",
    });
  }
};

module.exports = {
  jwtValidations,
};
