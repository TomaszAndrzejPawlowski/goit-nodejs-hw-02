const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data: contacts,
    });
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.json({
        status: "success",
        code: 200,
        data: contact,
      });
    } else {
      res.status(404).json({
        status: "failure",
        code: 404,
        message: `Cannot find a contact with id: ${req.params.contactId}`,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = {
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
      favorite: req.query.favorite || false,
    };
    const result = await addContact(body);
    if (result && result.status !== 400) {
      res.status(201).json({
        status: "success",
        code: 201,
        data: result,
      });
    } else {
      res.status(400).json({
        status: "failure",
        code: 400,
        message: result.message,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const message = await removeContact(req.params.contactId);
    if (message) {
      res.json({
        status: "success",
        code: 200,
        message: message,
      });
    } else {
      res.status(404).json({
        status: "failure",
        code: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const body = {
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
      favorite: req.query.favorite,
    };
    const result = await updateContact(req.params.contactId, body);
    if (result && result.status !== 400 && result !== 400) {
      res.json({
        status: "success",
        code: 200,
        data: result,
      });
    } else if (!result) {
      res.status(404).json({
        status: "failure",
        code: 404,
        message: `Not found`,
      });
    } else {
      res.status(400).json({
        status: "failure",
        code: 400,
        message: result.message || "Provide a change to make",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const body = {
      favorite: req.query.favorite,
    };
    const result = await updateStatusContact(req.params.contactId, body);
    if (result && result.status !== 400 && result !== 400) {
      res.json({
        status: "success",
        code: 200,
        data: result,
      });
    } else if (!result) {
      res.status(404).json({
        status: "failure",
        code: 404,
        message: `Not found`,
      });
    } else {
      res.status(400).json({
        status: "failure",
        code: 400,
        message: result.message || "missing field favorite",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
});

module.exports = router;
