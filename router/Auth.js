const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

require("../db/connection");
const User = require("../model/Schema");

router.get("/", (req, res) => {
  res.send(`Hello world from the router Auth.js`);
});

// Using Promise
// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "Please filled the field properly" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already Exist" });
//       }

//       const user = new User({ name, email, phone, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "user registered successfully" });
//         })
//         .catch((err) => res.status(500).json({ error: "Failed to register" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// Async - Await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please filled the field properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password does not matched" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      await user.save();

      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post("/signin", async (req, res) => {
  // console.log(req.body);
  // res.json({ message: "Awesome" });
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "please filled the data" });
    }

    const userLogin = await User.findOne({ email: email });

    // console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.json({ error: "Invalid Credientials pass" });
        return;
      }

      res.json({ message: "User Signin Successfully" });
    } else {
      res.json({ error: "Invalid Credientials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//About Us Page
router.get("/about", authenticate, (req, res) => {
  console.log(`Hello my about`);
  res.send(req.getUser);
});

//get user data for contact and home page
router.get("/getData", authenticate, (req, res) => {
  // console.log(`Hello my about`);
  res.send(req.getUser);
});

//contact us page
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      console.log("Error in contact form");
      return res.json({ error: "please fill the contact form" });
    }

    const userContact = await User.findOne({ _id: req.userId });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save();

      res.status(201).json({ message: "user contact successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//Logout Page
router.get("/logout", (req, res) => {
  console.log(`Hello from logout`);
  res.clearCookie('jwtoken', {path: "/"})
  res.status(200).send("User logout");
});


module.exports = router;
