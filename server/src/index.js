const express = require("express");
const cors = require("cors");
const contactsRouter = require("./routes/contacts");
const { db, initializeDatabase } = require("./db");

const app = express();
const port = process.env.PORT || 4000;
let httpServer;
let isShuttingDown = false;

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

    httpServer = app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize database.", error);
    process.exit(1);
  }
}

startServer();

function closeHttpServer() {
  return new Promise((resolve) => {
    if (!httpServer) {
      resolve(undefined);
      return;
    }

    httpServer.close(() => resolve(undefined));
  });
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(undefined);
    });
  });
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}. Shutting down...`);

  try {
    await closeHttpServer();
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Shutdown failed.", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
