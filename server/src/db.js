const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dataDirectory = path.join(__dirname, "..", "data");
const databasePath = path.join(dataDirectory, "contacts.db");
const seedContacts = [
  {
    name: "Ava Johnson",
    phone: "+1 415 555 0147",
    email: "ava.johnson@example.com",
    avatar: null
  },
  {
    name: "Noah Kim",
    phone: "+1 212 555 0188",
    email: null,
    avatar: null
  },
  {
    name: "Priya Patel",
    phone: null,
    email: "priya.patel@example.com",
    avatar: null
  },
  {
    name: "Luca Moretti",
    phone: "+1 310 555 0102",
    email: "luca.moretti@example.com",
    avatar: null
  },
  {
    name: "Elena Petrova",
    phone: null,
    email: null,
    avatar: null
  }
];

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const db = new sqlite3.Database(databasePath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function handleResult(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        id: this.lastID,
        changes: this.changes
      });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      avatar TEXT
    )
  `);

  const result = await get("SELECT COUNT(*) AS count FROM contacts");
  const count = result?.count ?? 0;
  if (count > 0) {
    return 0;
  }

  for (const contact of seedContacts) {
    await run(
      "INSERT INTO contacts (name, phone, email, avatar) VALUES (?, ?, ?, ?)",
      [contact.name, contact.phone, contact.email, contact.avatar]
    );
  }

  return seedContacts.length;
}

module.exports = {
  db,
  run,
  get,
  all,
  initializeDatabase
};
