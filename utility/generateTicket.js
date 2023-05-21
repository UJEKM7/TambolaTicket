const Ticket = require("../model/TicketSchema");

// Function to generate Tambola tickets
async function generateTambolaTickets(numTickets) {
  const tickets = [];
  let ticketId;
  for (let i = 0; i < numTickets; i++) {
    let ticketExists = true;
    let ticket;

    while (ticketExists) {
      ticket = Array.from({ length: 1 }, () =>
        Array.from({ length: 9 }, () => 0)
      );

      const columns = Array.from({ length: 9 }, (_, index) => {
        const columnRange = [index * 10 + 1, index * 10 + 10];
        const columnNumbers = getUniqueRandomNumbers(
          columnRange[0],
          columnRange[1],
          5
        );
        return columnNumbers;
      });

      for (let col = 0; col < 9; col++) {
        const colNumbers = Array.from({ length: 1 }, (_, row) => {
          if (row === 0) return columns[col].shift();
          else return 0;
        });
        ticket.forEach((row, rowIndex) => {
          if (row[col] === 0) {
            row[col] = colNumbers[rowIndex];
          }
        });
      }

      // Check if the ticket already exists in the database
      const existingTicket = await Ticket.findOne({ ticket });
      if (!existingTicket) {
        ticketExists = false;
      }
    }
    ticketId = generateUniqueTicketId();
    tickets.push(ticket);
  }

  return { tickets, ticketId };
}

// Function to get unique random numbers
function getUniqueRandomNumbers(min, max, count) {
  const numbers = [];
  while (numbers.length < count) {
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }
  return numbers;
}

// Function to generate a unique ticketId
function generateUniqueTicketId() {
  const timestamp = Date.now().toString(); // Get current timestamp
  const randomNumber = Math.floor(Math.random() * 1000).toString(); // Generate a random number
  const ticketId = timestamp + randomNumber; // Combine timestamp and random number
  return ticketId;
}

module.exports = generateTambolaTickets;
