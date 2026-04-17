const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dataDirectory = path.join(__dirname, "..", "data");
const databasePath = path.join(dataDirectory, "contacts.db");
const imagesDirectory = path.join(
  __dirname,
  "..",
  "..",
  "client",
  "src",
  "assets",
  "images"
);

const imageMimeTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function readImageAsDataUri(fileName) {
  if (!fileName) {
    return null;
  }

  const imagePath = path.join(imagesDirectory, fileName);
  if (!fs.existsSync(imagePath)) {
    return null;
  }

  const extension = path.extname(imagePath).toLowerCase();
  const mimeType = imageMimeTypes[extension] ?? "application/octet-stream";
  const imageBuffer = fs.readFileSync(imagePath);
  return `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
}

const defaultSeedAvatar = readImageAsDataUri("Default.png");

function resolveSeedAvatar(fileName) {
  return readImageAsDataUri(fileName) ?? defaultSeedAvatar;
}

const seedContacts = [
  {
    name: "Timothy Lewis",
    phone: "+36 01 234 5678",
    email: null,
    avatar: resolveSeedAvatar("Timothy.png")
  },
  {
    name: "Sarah Wright",
    phone: "+36 01 234 5678",
    email: null,
    avatar: resolveSeedAvatar("Sarah.png")
  },
  {
    name: "Lucy Jones",
    phone: "+36 01 234 5678",
    email: null,
    avatar: resolveSeedAvatar("Lucy.png")
  },
  {
    name: "Jake Perez",
    phone: "+36 01 234 5678",
    email: null,
    avatar: resolveSeedAvatar("Jake.png")
  },
  {
    name: "Adebayo Rodriguez",
    phone: "+36 01 234 5678",
    email: null,
    avatar: resolveSeedAvatar("Adebayo.png")
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

  await run("BEGIN TRANSACTION");
  try {
    for (const contact of seedContacts) {
      await run(
        "INSERT INTO contacts (name, phone, email, avatar) VALUES (?, ?, ?, ?)",
        [contact.name, contact.phone, contact.email, contact.avatar]
      );
    }
    await run("COMMIT");
  } catch (error) {
    await run("ROLLBACK");
    throw error;
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
