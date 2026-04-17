const express = require("express");
const cors = require("cors");
const contactsRouter = require("./routes/contacts");
const { db, initializeDatabase } = require("./db");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/contacts", contactsRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Internal server error." });
});

async function startServer() {
  try {
    const seededCount = await initializeDatabase();
    if (seededCount > 0) {
      console.log(`Seeded ${seededCount} contacts.`);
    }

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize database.", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
