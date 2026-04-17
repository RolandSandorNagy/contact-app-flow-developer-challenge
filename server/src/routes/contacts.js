const express = require("express");
const { all, get, run } = require("../db");

const router = express.Router();

function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseId(rawId) {
  const id = Number.parseInt(rawId, 10);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}

router.get("/", async (request, response, next) => {
  try {
    const contacts = await all(
      "SELECT id, name, phone, email, avatar FROM contacts ORDER BY id ASC"
    );

    response.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const rawName = typeof request.body.name === "string" ? request.body.name.trim() : "";
    if (!rawName) {
      response.status(400).json({ message: "Name is required." });
      return;
    }

    const phone = normalizeOptionalString(request.body.phone);
    const email = normalizeOptionalString(request.body.email);
    const avatar = normalizeOptionalString(request.body.avatar);

    const insertResult = await run(
      "INSERT INTO contacts (name, phone, email, avatar) VALUES (?, ?, ?, ?)",
      [rawName, phone, email, avatar]
    );

    const createdContact = await get(
      "SELECT id, name, phone, email, avatar FROM contacts WHERE id = ?",
      [insertResult.id]
    );

    response.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (request, response, next) => {
  try {
    const id = parseId(request.params.id);
    if (!id) {
      response.status(400).json({ message: "Invalid contact id." });
      return;
    }

    const existingContact = await get(
      "SELECT id, name, phone, email, avatar FROM contacts WHERE id = ?",
      [id]
    );

    if (!existingContact) {
      response.status(404).json({ message: "Contact not found." });
      return;
    }

    let name = existingContact.name;
    if (Object.prototype.hasOwnProperty.call(request.body, "name")) {
      if (typeof request.body.name !== "string" || request.body.name.trim().length === 0) {
        response.status(400).json({ message: "Name is required." });
        return;
      }
      name = request.body.name.trim();
    }

    const phone = Object.prototype.hasOwnProperty.call(request.body, "phone")
      ? normalizeOptionalString(request.body.phone)
      : existingContact.phone;
    const email = Object.prototype.hasOwnProperty.call(request.body, "email")
      ? normalizeOptionalString(request.body.email)
      : existingContact.email;
    const avatar = Object.prototype.hasOwnProperty.call(request.body, "avatar")
      ? normalizeOptionalString(request.body.avatar)
      : existingContact.avatar;

    await run(
      "UPDATE contacts SET name = ?, phone = ?, email = ?, avatar = ? WHERE id = ?",
      [name, phone, email, avatar, id]
    );

    const updatedContact = await get(
      "SELECT id, name, phone, email, avatar FROM contacts WHERE id = ?",
      [id]
    );

    response.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const id = parseId(request.params.id);
    if (!id) {
      response.status(400).json({ message: "Invalid contact id." });
      return;
    }

    const deleteResult = await run("DELETE FROM contacts WHERE id = ?", [id]);
    if (deleteResult.changes === 0) {
      response.status(404).json({ message: "Contact not found." });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
