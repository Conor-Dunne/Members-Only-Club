const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.update_memberstatus = [

  // Validate and sanitize fields.
  body("password", "Please enter a password").trim().isLength({ min: 1 }).escape(),


  // Process request after validation and sanitization.
  asyncHandler(async(req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    try {
        // Find the user document by id
        const user = await User.findById(req.user._id);

        if (!user) {
          const err = new Error("User not found");
          err.status = 404;
          return next(err);
        }
    
        if (req.body.password === "MEMBER") {
          // Update the 'isMember' field to true
          user.isMember = true;
          await user.save();
          res.redirect('/welcome')
          // return res.json({ message: 'User is now a member' });
        } else {
          req.session.message ='Wrong password!'
          res.redirect('/member')
          return res.status(404).json({ message: 'Wrong password!' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
})


] 