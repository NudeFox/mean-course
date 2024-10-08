const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        console.log(result);
        const token = jwt.sign(
          { email: result.email, userId: result._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" },
        );

        res.status(201).json({
          message: "User created!",
          token: token,
          expiresIn: 3600,
          userId: result._id,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
          message: err.errors.email
            ? "This email is already registered"
            : "An error occurred",
        });
      });
  });
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 401,
          message: "Auth failed. User not found",
        });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" },
      );

      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        message: err.message || "Auth failed due to server error",
        error: err,
      });
    });
};
