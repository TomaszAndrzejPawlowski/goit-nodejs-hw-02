const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
  getPageOfContacts,
  getContactByFavorite,
} = require("../../models/contacts");
const router = express.Router();

router.get("/", async (req, res, next) => {
  if (Object.keys(req.query).length === 0) return next();
  try {
    console.log("  get by favorite");
    const result = await getContactByFavorite(req.query.favorite);
    if (result && result.status !== 400) {
      return res.json({
        status: "success",
        code: 200,
        data: result,
      });
    }
    if (result.status === 400) {
      return res.status(400).json({
        status: "failure",
        code: 400,
        data: result.message,
      });
    }
    res.status(404).json({
      status: "failure",
      code: 404,
      message: `Cannot find a contact with id: `,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
  }
});

router.get("/", async (req, res, next) => {
  try {
    console.log("  simple get");
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data: contacts,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
  }
});

router.get("/pagination", async (req, res, next) => {
  try {
    const pagination = {
      page: req.query.page,
      limit: req.query.limit,
    };
    const result = await getPageOfContacts(pagination);
    console.log(result + " tutaj");
    if (result && result.pagesLeft < 0) {
      return res.status(400).json({
        status: "failure",
        code: 400,
        message:
          "You have reached the end of contact list, try typing a lower page number",
      });
    }
    if (result && result.status === 400) {
      return res.status(400).json({
        status: "failure",
        code: 400,
        message: result.message,
      });
    }
    if (result) {
      return res.json({
        status: "success",
        code: 200,
        data: result,
      });
    }
    return res.status(404).json({
      status: "failure",
      code: 404,
      message: `Cannot find contacts`,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
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
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
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
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
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
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
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
      return;
    }
    if (!result) {
      res.status(404).json({
        status: "failure",
        code: 404,
        message: `Not found`,
      });
      return;
    }
    res.status(400).json({
      status: "failure",
      code: 400,
      message: result.message || "Provide a change to make",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
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
      return;
    }
    if (!result) {
      res.status(404).json({
        status: "failure",
        code: 404,
        message: `Not found`,
      });
      return;
    }
    res.status(400).json({
      status: "failure",
      code: 400,
      message: result.message || "missing field favorite",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "failure",
      code: 500,
      message: err.message,
    });
  }
});

module.exports = router;
