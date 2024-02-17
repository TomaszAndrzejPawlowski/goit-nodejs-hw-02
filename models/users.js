const { newUserAuthSchema } = require("../validation/userValidation");
const User = require("../service/schemas/user");

const registerUser = async (body) => {
  try {
    const { email, password } = body;
    console.log(body);
    await newUserAuthSchema.validateAsync(body);
    email.toLowerCase();
    const user = await User.findOne({ email });
    if (user) {
      return 409;
    }
    const newUser = new User({ email });
    newUser.setPassword(password);
    console.log(newUser);
    await newUser.save();
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
      return err;
    }
    console.log(err.message);
  }
};

// const loginUser = async (body) => {
//   try {
//     const { email, password } = body
//     email.toLowerCase();
//     const user = await User.findOne({ email });
//     if (user) {

//     } else {

//     }

//   } catch (err) {
//     if (err.isJoi) {
//       err.status = 400;
//       return err;
//     }
//     console.log(err.message);
// }
// }

module.exports = {
  registerUser,
  // , loginUser
};
