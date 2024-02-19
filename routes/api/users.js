const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  updateSubscription,
} = require("../../models/users");
const User = require("../../service/schemas/user");
const auth = require("../../service/middleware/middleware");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const body = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await registerUser(body);
    if (result && result !== 409 && result.status !== 400) {
      await result.save();
      return res.status(201).json({
        status: "success",
        code: 201,
        data: {
          user: {
            email: result.email,
            subscription: result.subscription,
          },
        },
      });
    }
    if (result === 409) {
      return res.status(409).json({
        status: "failure",
        code: 409,
        message: "Email in use",
      });
    }
    res.status(400).json({
      status: "failure",
      code: 400,
      message: result.message,
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

router.post("/login", async (req, res, next) => {
  try {
    const body = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await loginUser(body);
    if (result && result.status === 400) {
      return res.status(400).json({
        status: "failure",
        code: 400,
        message: result.message,
      });
    }
    if (result && result.status !== 400) {
      await User.updateOne(
        { _id: result._id },
        { $set: { token: result.token } }
      );
      return res.status(200).json({
        status: "success",
        code: 200,
        data: {
          token: result.token,
          user: {
            email: result.email,
            subscription: result.subscription,
          },
        },
      });
    } else {
      res.status(401).json({
        status: "failure",
        code: 401,
        message: "Email or password is wrong",
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

router.get("/logout", auth, async (req, res, next) => {
  if (!req.user.token) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
    });
  }
  try {
    await User.updateOne({ token: req.user.token }, { $set: { token: null } });
    res.status(200).json({
      status: "success",
      code: 204,
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

router.get("/current", auth, async (req, res, next) => {
  if (!req.user.token) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
    });
  }
  try {
    const { email, subscription, token } = req.user;
    const result = await currentUser(token);
    if (result && result !== 400 && result.status !== 400) {
      return res.status(200).json({
        status: "success",
        code: 200,
        data: { email, subscription },
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

router.patch("/", auth, async (req, res, next) => {
  if (!req.user.token) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
    });
  }
  try {
    const body = {
      token: req.user.token,
      subscription: req.query.subscription,
    };
    const result = await updateSubscription(body);
    if (result && result !== 400 && result.status !== 400) {
      await User.findOneAndUpdate(
        { token: result.token },
        { $set: { subscription: body.subscription } }
      );
      return res.json({
        status: "success",
        code: 200,
        data: {
          email: result.email,
          subscription: body.subscription,
        },
      });
    }
    if (result.status === 400 || result === 400) {
      return res.status(400).json({
        status: "failure",
        code: 400,
        message: result.message || "missing field subscription",
      });
    }
    return res.status(404).json({
      status: "failure",
      code: 404,
      message: `Not found`,
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
