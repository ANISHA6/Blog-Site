const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); //library for encryting the password

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save(); //save method is coming from mongoose
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); // Finding the user, which is inside the mongoDb
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password); //Comparing password with hashed password
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    res.status(200).json(others); //Not sending password to the user
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
