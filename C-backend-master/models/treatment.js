const { Schema, model } = require("mongoose");
const treatmentSchema = Schema({
  name: {
    type: String,
    required: [true],
  },
  total: {
    type: Number,
    required: [true],
  },
});

module.exports = model("Treatment", treatmentSchema);
