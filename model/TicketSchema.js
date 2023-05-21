const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticket: [
    {
      type: [[Number]], // 2D array to represent the ticket grid
      required: true,
    },
  ],
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = Ticket = mongoose.model("Ticket", ticketSchema);
