const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  }
});

module.exports = mongoose.model("Message", MessageSchema);
