const router = require("express")();

const { body, validationResult, param } = require("express-validator");

const generateTambolaTickets = require("../utility/generateTicket");

//Ticket Model
const Ticket = require("../model/TicketSchema");

// Tambola ticket create API
router.post(
  "/tickets",
  [
    body("numberOfTickets")
      .notEmpty()
      .withMessage("Number of tickets is required")
      .trim()
      .escape()
      .toInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { numberOfTickets } = req.body;

      // Generate tambola tickets
      const { tickets, ticketId } = await generateTambolaTickets(
        parseInt(numberOfTickets)
      );

      // Save tickets to the database
      const savedTickets = await Ticket.create({ ticket: tickets, ticketId });

      return res.status(201).json({ savedTickets });
    } catch (error) {
      console.error("Error creating tickets", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Tambola ticket fetch API
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Ticket ID is required")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Pagination logic
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      // Fetch tickets associated with the given ID from the database
      const tickets = await Ticket.find({ ticketId: id })
        .skip(parseInt(startIndex))
        .limit(parseInt(limit));

      // Count the total number of tickets associated with the given ID
      const totalTickets = await Ticket.countDocuments({ ticketId: id });

      // Return the ticket data along with pagination details as the API response
      return res.status(200).json({
        totalTickets,
        totalPages: Math.ceil(totalTickets / limit),
        currentPage: page,
        tickets,
      });
    } catch (error) {
      console.error("Error fetching tickets", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
