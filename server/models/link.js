const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  original: String,
  short: String,
  probability: mongoose.Decimal128,
});

// compile model from schema
module.exports = mongoose.model("link", LinkSchema);
