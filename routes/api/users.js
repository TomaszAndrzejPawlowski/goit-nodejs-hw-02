const express = require("express");
const {
  registerUser,
  // , loginUser
} = require("../../models/users");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const body = {
      email: req.body.email,
      password: req.body.password,
    };
    console.log(body);
    const result = await registerUser(body);
    console.log(result + " tutaj");

    if (result && result !== 409 && result.status !== 400) {
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

// router.post("/login", async (req, res, next) => {
//   try {
//     const body = {
//       email: req.body.email,
//       password: req.body.password,
//     };
//     const result = await loginUser(body);
//     if (result) {

//     } else {
//       res.status(401).json({
//         status: "failure",
//         code: 401,
//         message: "Email or password is wrong",
//       });
//     }
//   } catch (err) {}
// });

module.exports = router;
